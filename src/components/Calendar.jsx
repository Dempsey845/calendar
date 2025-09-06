export default function Calendar() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date();
  const day = date.getDate();

  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  const firstWeekdayIndex = firstDay.getDay();

  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {weekdays.map((day) => (
        <div key={day} className="text-center font-semibold text-gray-600">
          {day}
        </div>
      ))}

      {Array.from({ length: firstWeekdayIndex }).map((_, i) => (
        <div key={`shift${i}`}></div>
      ))}

      {Array.from({ length: daysInMonth }).map((_, i) => (
        <div
          key={i}
          className={`aspect-square flex items-center justify-center rounded-lg border border-gray-200 ${
            i == day - 1 ? "bg-gray-300" : "bg-white"
          } shadow-sm ${
            i == day - 1 ? "hover:bg-gray-400" : "hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
