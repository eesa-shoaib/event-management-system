import type { EventItem } from "../../eventsSlice";

export default function EventSchedule({ event }: { event: EventItem }) {
  if (!event.date && !event.time) return null;

  return (
    <section>
      <h2 className="font-semibold">Date and time</h2>
      <p>
        {[event.date, event.time].filter(Boolean).join(" at ")}
      </p>
    </section>
  );
}
