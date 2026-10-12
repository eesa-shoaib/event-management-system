import type { EventItem } from "../../eventsSlice";

export default function VenueLocation({ event }: { event: EventItem }) {
  const location = [event.address, event.city, event.state, event.country]
    .filter(Boolean)
    .join(", ");

  if (!event.venue && !location) return null;

  return (
    <section>
      <h2 className="font-semibold">Venue and location</h2>
      {event.venue && <p>{event.venue}</p>}
      {location && <p>{location}</p>}
    </section>
  );
}
