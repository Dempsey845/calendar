import { useEffect, useState } from "react";

export default function Calendar() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [date, setDate] = useState(new Date());
  const [monthInfo, setMonthInfo] = useState({
    day: null,
    year: null,
    month: null,
    daysInMonth: null,
    firstWeekdayIndex: null,
  });

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();

  useEffect(() => {
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const firstWeekdayIndex = firstDay.getDay(); // 0=Sun, 1=Mon, ...

    setMonthInfo({ day, year, month, daysInMonth, firstWeekdayIndex });
  }, [date]);

  return (
    <>
      <div className="navigation flex justify-between items-center p-4">
        <button
          onClick={() =>
            setDate(new Date(monthInfo.year, monthInfo.month - 1, 1))
          }
          className="btn btn-primary"
        >
          Prev
        </button>

        <h2 className="text-lg font-bold">
          {date.toLocaleString("default", { month: "long" })} {monthInfo.year}
        </h2>

        <button
          onClick={() =>
            setDate(new Date(monthInfo.year, monthInfo.month + 1, 1))
          }
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 p-4">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}

        {Array.from({ length: monthInfo.firstWeekdayIndex }).map((_, i) => (
          <div
            className="aspect-square flex items-center justify-center rounded-lg border border-gray-200 bg-gray-600"
            key={`shift${i}`}
          ></div>
        ))}

        {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center rounded-lg border border-gray-200 ${
              monthInfo.month == currentMonth && i == currentDay - 1
                ? "bg-gray-300"
                : "bg-white"
            } shadow-sm ${
              monthInfo.month == currentMonth && i == currentDay - 1
                ? "hover:bg-gray-400"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </>
  );
}
