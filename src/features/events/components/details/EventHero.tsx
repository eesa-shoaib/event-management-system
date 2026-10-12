import type { EventItem } from "../../eventsSlice";

export default function EventHero({ event }: { event: EventItem }) {
  return (
    <header className="space-y-4">
      {event.photos && (
        <img
          className="max-h-96 w-full rounded-box object-cover"
          src={event.photos}
          alt=""
        />
      )}
      <h1 className="text-3xl font-bold">{event.name}</h1>
    </header>
  );
}
