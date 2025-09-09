import { useState } from "react";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Day({
  date,
  dayData,
  addEvent,
  updateEvent,
  deleteEvent,
}) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const weekdayIndex = date.getDay();
  const dayString = `${weekdays[weekdayIndex]}, ${months[month]} ${dayOfMonth}, ${year}`;

  // 8:00 → 17:30 in 30-min intervals
  const slots = Array.from({ length: 20 }, (_, i) => 8 + i * 0.5);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [collapsed, setCollapsed] = useState(false);

  const [multiSelectMode, setMultiSelectMode] = useState(false);

  const toggleSlotSelection = (hour) => {
    setSelectedSlots((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const formatHour = (hour) =>
    `${Math.floor(hour)}:${hour % 1 === 0 ? "00" : "30"}`;

  const startDrag = (hour) => {
    setIsDragging(true);
    setSelectedSlots([hour]);
  };
  const continueDrag = (hour) => {
    if (!isDragging) return;
    const start = Math.min(selectedSlots[0], hour);
    const end = Math.max(selectedSlots[0], hour);
    const range = [];
    for (let h = start; h <= end; h += 0.5) range.push(h);
    setSelectedSlots(range);
  };
  const endDrag = () => setIsDragging(false);

  const openFormForAdd = () => {
    setSelectedEvent(null);
    setFormData({ title: "", description: "", location: "" });
    setShowForm(true);
  };
  const openFormForEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
    });
    const range = [];
    for (let h = event.startHour; h < event.endHour; h += 0.5) range.push(h);
    setSelectedSlots(range);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || selectedSlots.length === 0) return;
    const startHour = Math.min(...selectedSlots);
    const endHour = Math.max(...selectedSlots) + 0.5; // include last half-hour

    if (selectedEvent)
      updateEvent({ ...selectedEvent, ...formData, startHour, endHour });
    else addEvent({ ...formData, startHour, endHour });

    setShowForm(false);
    setSelectedSlots([]);
    setFormData({ title: "", description: "", location: "" });
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    if (selectedEvent) deleteEvent(selectedEvent.id);
    setShowForm(false);
    setSelectedSlots([]);
    setFormData({ title: "", description: "", location: "" });
    setSelectedEvent(null);
  };

  return (
    <div
      className="p-4  rounded-lg shadow-sm select-none max-w-full mx-auto"
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <h1 className="font-bold text-xl sm:text-lg mb-4 text-center sm:text-left">
        {dayString}
      </h1>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-4 gap-2">
        <button
          onClick={openFormForAdd}
          disabled={selectedSlots.length === 0}
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          Add Event
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400 transition-colors"
        >
          {collapsed ? "Show All Slots" : "Collapse Empty Slots"}
        </button>
        <button
          onClick={() => setMultiSelectMode(!multiSelectMode)}
          className={`w-full sm:w-auto px-4 py-2 rounded shadow transition-colors ${
            multiSelectMode
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          {multiSelectMode ? "Multi-Select: ON" : "Multi-Select: OFF"}
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
            {["title", "description", "location"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            ))}
            <div className="flex flex-wrap justify-end gap-2 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded shadow hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Time slots */}
      <div className="flex flex-col space-y-1 max-h-[70vh] overflow-y-auto">
        {slots
          .filter((hour) => {
            if (!collapsed) return true;
            const eventsThisHour = dayData.events.filter(
              (e) => hour >= e.startHour && hour < e.endHour
            );
            // keep slot if it has >1 event or is the start hour of an event
            return (
              eventsThisHour.length > 1 ||
              eventsThisHour.some((e) => e.startHour === hour)
            );
          })
          .map((hour) => {
            const eventsThisHour = [
              ...new Map(
                dayData.events
                  .filter((e) => hour >= e.startHour && hour < e.endHour)
                  .map((e) => [e.id, e])
              ).values(),
            ];

            return (
              <div
                key={hour}
                onMouseDown={() => !multiSelectMode && startDrag(hour)}
                onMouseEnter={() => !multiSelectMode && continueDrag(hour)}
                onClick={() => multiSelectMode && toggleSlotSelection(hour)}
                className={`flex border rounded p-2 sm:p-3 h-16 sm:h-20 items-start cursor-pointer transition-colors ${
                  selectedSlots.includes(hour)
                    ? "bg-blue-200 border-blue-400"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="w-16 text-gray-500 font-semibold text-sm sm:text-base">
                  {formatHour(hour)}
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  {eventsThisHour.length > 0 ? (
                    eventsThisHour.map((event) => (
                      <div
                        key={event.id}
                        className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs sm:text-sm cursor-pointer truncate"
                        onClick={() => openFormForEdit(event)}
                        title={`${event.title} (${formatHour(
                          event.startHour
                        )} - ${formatHour(event.endHour)})`}
                      >
                        {event.title} ({formatHour(event.startHour)} -{" "}
                        {formatHour(event.endHour)})
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-300 text-xs sm:text-sm italic">
                      No events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
