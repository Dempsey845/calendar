import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { isAdmin, signInWithGoogle } from "../auth";
import App from "../App";

function AdminApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const admin = await isAdmin(firebaseUser.uid);
        if (admin) setUser(firebaseUser);
        else setUser(null); // not admin
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={signInWithGoogle}
          className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
        >
          <span>Sign in with Google</span>
        </button>
      </div>
    );

  return <App user={user} />;
}

export default AdminApp;
