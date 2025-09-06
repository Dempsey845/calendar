export default function Day({ date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return (
    <div>
      <h1>Year: {year}</h1>
      <h1>Month: {month}</h1>
      <h1>Day: {day}</h1>
    </div>
  );
}
