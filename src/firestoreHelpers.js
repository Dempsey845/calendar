import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/*
Firestore structure:

collection: "days"
  document: "2025-09-01"
    date: "2025-09-01"
    createdAt: <timestamp>
    events: [
      { id, title, description, location, startHour, endHour }
    ]
*/

// --- Add or overwrite a whole day ---
export async function addOrUpdateDay(date, events = []) {
  const ref = doc(db, "days", date);
  await setDoc(
    ref,
    {
      date,
      events,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// --- One-time read of all days ---
export async function fetchDays() {
  const snap = await getDocs(collection(db, "days"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// --- Subscribe to realtime updates ---
export function subscribeDays(onUpdate) {
  const q = query(collection(db, "days"), orderBy("date", "asc"));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const days = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onUpdate(days);
    },
    (err) => console.error("subscribeDays error:", err)
  );
  return unsubscribe;
}

// --- Update events for a whole day ---
export async function updateDayEvents(date, events) {
  const ref = doc(db, "days", date);
  await updateDoc(ref, {
    events,
    updatedAt: serverTimestamp(),
  });
}

// --- Delete a whole day ---
export async function removeDay(date) {
  const ref = doc(db, "days", date);
  return deleteDoc(ref);
}

/* ---------------------------
   Event-level helpers
--------------------------- */

// Add a single event to a given date (creates document if missing)
export async function addEventToDay(date, event) {
  const ref = doc(db, "days", date);
  const snap = await getDoc(ref);

  let events = [];
  if (snap.exists()) {
    events = snap.data().events || [];
  }

  const newEvent = { id: Date.now(), ...event };
  events.push(newEvent);

  await setDoc(
    ref,
    {
      date,
      events,
      createdAt: snap.exists() ? snap.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true } // creates the doc if missing
  );

  return newEvent;
}

// Update a single event inside a given date
export async function updateEventInDay(date, updatedEvent) {
  const ref = doc(db, "days", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error(`Day ${date} not found`);

  const events = snap.data().events || [];
  const newEvents = events.map((e) =>
    e.id === updatedEvent.id ? updatedEvent : e
  );

  await setDoc(
    ref,
    { events: newEvents, updatedAt: serverTimestamp() },
    { merge: true }
  );

  return updatedEvent;
}

// Delete a single event inside a given date
export async function deleteEventFromDay(date, eventId) {
  const ref = doc(db, "days", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error(`Day ${date} not found`);

  const events = snap.data().events || [];
  const newEvents = events.filter((e) => e.id !== eventId);

  await setDoc(
    ref,
    { events: newEvents, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
