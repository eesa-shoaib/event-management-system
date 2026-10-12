import type { EventItem } from "../../eventsSlice";

export default function EventMetadata({ event }: { event: EventItem }) {
  return (
    <section className="space-y-1">
      <h2 className="font-semibold">Category</h2>
      <p>{[event.classification, event.genre].filter(Boolean).join(" · ")}</p>
      {event.url && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <a
            className="link link-primary"
            href={event.url}
            target="_blank"
            rel="noreferrer"
          >
            More event information
          </a>
          <button
            className="btn btn-primary btn-lg"
            type="button"
          >
            Register
          </button>
        </div>
      )}
    </section>
  );
}
