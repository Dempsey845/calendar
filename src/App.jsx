import { useEffect, useState } from "react";
import Calendar from "./components/Calendar";
import Day from "./components/Day";
import {
  fetchDays,
  addEventToDay,
  updateEventInDay,
  deleteEventFromDay,
} from "./firestoreHelpers";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]); // start empty, load from Firestore

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  // filter days by current month/year
  const monthData = data.filter((d) => {
    const dObj = new Date(d.date);
    return (
      dObj.getMonth() === selectedMonth && dObj.getFullYear() === selectedYear
    );
  });

  // fetch days when month/year changes
  useEffect(() => {
    async function loadDays() {
      try {
        const days = await fetchDays();
        console.log("Fetched days:", days);
        setData(days);
      } catch (err) {
        console.error("Error fetching days:", err);
      }
    }
    loadDays();
  }, [selectedYear, selectedMonth]);

  const pad = (n) => String(n).padStart(2, "0");
  const selectedDateString = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(
    selectedDate.getDate()
  )}`;

  const dayData = monthData.find((d) => d.date === selectedDateString) || {
    date: selectedDateString,
    events: [],
  };

  // Add event (sync with Firestore)
  const addEvent = async (newEvent) => {
    try {
      const eventWithId = await addEventToDay(selectedDateString, newEvent);
      setData((prevData) => {
        const dataCopy = [...prevData];
        const dayIndex = dataCopy.findIndex(
          (d) => d.date === selectedDateString
        );

        if (dayIndex >= 0) {
          dataCopy[dayIndex].events.push(eventWithId);
        } else {
          dataCopy.push({ date: selectedDateString, events: [eventWithId] });
        }

        return dataCopy;
      });
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  // Update event (sync with Firestore)
  const updateEvent = async (updatedEvent) => {
    try {
      await updateEventInDay(selectedDateString, updatedEvent);
      setData((prevData) => {
        const dataCopy = [...prevData];
        const dayIndex = dataCopy.findIndex(
          (d) => d.date === selectedDateString
        );
        if (dayIndex >= 0) {
          dataCopy[dayIndex].events = dataCopy[dayIndex].events.map((e) =>
            e.id === updatedEvent.id ? updatedEvent : e
          );
        }
        return dataCopy;
      });
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  // Delete event (sync with Firestore)
  const deleteEvent = async (eventId) => {
    try {
      await deleteEventFromDay(selectedDateString, eventId);
      setData((prevData) => {
        const dataCopy = [...prevData];
        const dayIndex = dataCopy.findIndex(
          (d) => d.date === selectedDateString
        );
        if (dayIndex >= 0) {
          dataCopy[dayIndex].events = dataCopy[dayIndex].events.filter(
            (e) => e.id !== eventId
          );
        }
        return dataCopy;
      });
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="lg:mx-32">
      <Calendar setSelectedDate={setSelectedDate} monthData={monthData} />
      <Day
        date={selectedDate}
        dayData={dayData}
        addEvent={addEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
      />
    </div>
  );
}

export default App;
