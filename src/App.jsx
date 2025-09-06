import { useState } from "react";
import Calendar from "./components/Calendar";
import Day from "./components/Day";

const sepData = [
  {
    date: "2025-09-01",
    events: [
      {
        id: 1,
        title: "Morning Jog",
        description: "5km run",
        location: "Park",
        startHour: 7, // 7:00
        endHour: 8, // 8:00
      },
    ],
  },
  {
    date: "2025-09-03",
    events: [
      {
        id: 2,
        title: "Team Meeting",
        description: "Discuss Q4 roadmap",
        location: "Zoom",
        startHour: 12,
        endHour: 13,
      },
      {
        id: 3,
        title: "Gym",
        description: "Leg day workout",
        location: "Local gym",
        startHour: 18,
        endHour: 19,
      },
    ],
  },
  {
    date: "2025-09-05",
    events: [
      {
        id: 4,
        title: "Doctor Appointment",
        description: "Annual checkup",
        location: "Clinic",
        startHour: 10,
        endHour: 11,
      },
    ],
  },
];

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(sepData);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();
  const monthData = data.filter((d) => {
    const dObj = new Date(d.date);
    return (
      dObj.getMonth() === selectedMonth && dObj.getFullYear() === selectedYear
    );
  });

  const pad = (n) => String(n).padStart(2, "0");
  const selectedDateString = `${selectedYear}-${pad(selectedMonth + 1)}-${pad(
    selectedDate.getDate()
  )}`;

  const dayData = monthData.find((d) => d.date === selectedDateString) || {
    date: selectedDateString,
    events: [],
  };

  // Add event
  const addEvent = (newEvent) => {
    setData((prevData) => {
      const dataCopy = [...prevData];
      const dayIndex = dataCopy.findIndex((d) => d.date === selectedDateString);

      const eventWithId = { id: Date.now(), ...newEvent };

      if (dayIndex >= 0) {
        dataCopy[dayIndex].events.push(eventWithId);
      } else {
        dataCopy.push({ date: selectedDateString, events: [eventWithId] });
      }

      return dataCopy;
    });
  };

  // Update event
  const updateEvent = (updatedEvent) => {
    setData((prevData) => {
      const dataCopy = [...prevData];
      const dayIndex = dataCopy.findIndex((d) => d.date === selectedDateString);
      if (dayIndex >= 0) {
        dataCopy[dayIndex].events = dataCopy[dayIndex].events.map((e) =>
          e.id === updatedEvent.id ? updatedEvent : e
        );
      }
      return dataCopy;
    });
  };

  // Delete event
  const deleteEvent = (eventId) => {
    setData((prevData) => {
      const dataCopy = [...prevData];
      const dayIndex = dataCopy.findIndex((d) => d.date === selectedDateString);
      if (dayIndex >= 0) {
        dataCopy[dayIndex].events = dataCopy[dayIndex].events.filter(
          (e) => e.id !== eventId
        );
      }
      return dataCopy;
    });
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
