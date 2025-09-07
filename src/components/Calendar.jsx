import { useEffect, useState } from "react";

export default function Calendar({ selectedDate, setSelectedDate, monthData }) {
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
    const firstWeekdayIndex = firstDay.getDay();

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
      <div className="grid grid-cols-7 gap-2 p-4 auto-rows-min grid-flow-row-dense">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}

        {Array.from({ length: monthInfo.firstWeekdayIndex }).map((_, i) => (
          <div
            className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-600"
            key={`shift${i}`}
          ></div>
        ))}

        {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayString = `${monthInfo.year}-${String(
            monthInfo.month + 1
          ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

          const dayEvents =
            monthData.find((d) => d.date === dayString)?.events || [];

          const isSelectedDay =
            selectedDate.getFullYear() === monthInfo.year &&
            selectedDate.getMonth() === monthInfo.month &&
            selectedDate.getDate() === dayNum;

          return (
            <div
              key={i}
              onClick={() =>
                setSelectedDate(
                  new Date(monthInfo.year, monthInfo.month, dayNum)
                )
              }
              className={`flex flex-col items-start justify-start rounded-lg border border-gray-200 p-1 cursor-pointer transition-colors ${
                isSelectedDay
                  ? "bg-blue-100 hover:bg-blue-200"
                  : monthInfo.month === currentMonth && i === currentDay - 1
                  ? "bg-gray-300 hover:bg-gray-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="text-sm font-semibold mb-1">{dayNum}</div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="w-full text-xs truncate bg-blue-100 text-blue-700 rounded px-1 mb-0.5"
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
