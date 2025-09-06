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
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);

  const [selectedHours, setSelectedHours] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const startDrag = (hour) => {
    setIsDragging(true);
    setSelectedHours([hour]);
  };

  const continueDrag = (hour) => {
    if (!isDragging) return;
    const start = Math.min(selectedHours[0], hour);
    const end = Math.max(selectedHours[0], hour);
    const range = [];
    for (let h = start; h <= end; h++) range.push(h);
    setSelectedHours(range);
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
    setSelectedHours(
      Array.from(
        { length: event.endHour - event.startHour + 1 },
        (_, i) => event.startHour + i
      )
    );
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || selectedHours.length === 0) return;

    const startHour = Math.min(...selectedHours);
    const endHour = Math.max(...selectedHours);

    if (selectedEvent) {
      // Update existing event
      updateEvent({
        ...selectedEvent,
        ...formData,
        startHour,
        endHour,
      });
    } else {
      // Add new event
      addEvent({
        ...formData,
        startHour,
        endHour,
      });
    }

    setShowForm(false);
    setSelectedHours([]);
    setFormData({ title: "", description: "", location: "" });
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
    }
    setShowForm(false);
    setSelectedHours([]);
    setFormData({ title: "", description: "", location: "" });
    setSelectedEvent(null);
  };

  return (
    <div
      className="p-4 border rounded-lg shadow-sm select-none"
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >
      <h1 className="font-bold text-lg mb-4">{dayString}</h1>

      <button
        onClick={openFormForAdd}
        disabled={selectedHours.length === 0}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Add Event
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <h2 className="text-lg font-bold mb-4">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 mb-3 w-full rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              className="border p-2 mb-3 w-full rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="border p-2 mb-3 w-full rounded"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
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

      <div className="flex flex-col space-y-1">
        {hours.map((hour) => {
          const eventsThisHour = [
            ...new Map(
              dayData.events
                .filter((e) => hour >= e.startHour && hour <= e.endHour)
                .map((e) => [e.id, e])
            ).values(),
          ];

          const isSelected = selectedHours.includes(hour);

          return (
            <div
              key={hour}
              onMouseDown={() => startDrag(hour)}
              onMouseEnter={() => continueDrag(hour)}
              className={`flex border rounded p-2 h-16 items-start cursor-pointer ${
                isSelected
                  ? "bg-blue-200 border-blue-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <div className="w-16 text-gray-500 font-semibold">{`${hour}:00`}</div>

              <div className="flex-1 flex flex-col space-y-1">
                {eventsThisHour.length > 0 ? (
                  eventsThisHour.map((event) => (
                    <div
                      key={event.id}
                      className="bg-blue-100 text-blue-700 rounded px-2 py-1 text-sm cursor-pointer"
                      onClick={() => openFormForEdit(event)}
                    >
                      {event.title} ({event.startHour}:00 - {event.endHour}:00)
                    </div>
                  ))
                ) : (
                  <div className="text-gray-300 text-sm italic">No events</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
