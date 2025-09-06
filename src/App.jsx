import { useState } from "react";
import Calendar from "./components/Calendar";
import Day from "./components/Day";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <Calendar setSelectedDate={setSelectedDate} />
      <Day date={selectedDate} />
    </>
  );
}

export default App;
