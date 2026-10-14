import { Link } from "react-router-dom";
import type { EventItem } from "../features/events/eventsSlice";

interface EventFiltersProps {
  onSearch?: (keyword: string, classification: string) => void;
}

export function EventFilters({ onSearch }: EventFiltersProps) {

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSearch?.(
      String(formData.get("keyword") ?? ""),
      String(formData.get("classification") ?? ""),
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={handleSubmit}
    >
      <input
        className="input input-neutral w-full"
        name="keyword"
        placeholder="Search events"
        aria-label="Search events"
      />
      <select
        className="select select-neutral w-full sm:max-w-56"
        name="classification"
        aria-label="Filter by category"
        defaultValue=""
      >
        <option value="">All categories</option>
        <option value="Music">Music</option>
        <option value="Sports">Sports</option>
        <option value="Arts & Theatre">Arts &amp; Theatre</option>
        <option value="Family">Family</option>
        <option value="Film">Film</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>

      <button className="btn btn-secondary border-2 border-double border-neutral shadow-md" type="submit">
        Search
      </button>
    </form>
  );
}

interface EventCardProps {
  event: EventItem;
  onRegister?: (event: EventItem) => void;
  onCancel?: (eventId: string) => void;
  showRegister?: boolean;
  isRegistered?: boolean;
}

export function EventCard({
  event,
  onRegister,
  onCancel,
  showRegister = false,
  isRegistered,
}: EventCardProps) {
  return (
    <article className="card border border-neutral bg-base-200 shadow-lg rounded-4xl sm:card-side">
      {event.photos && (
        <figure className="sm:max-w-56">
          <img src={event.photos} alt="" className="h-48 w-full object-cover sm:h-full" />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{event.name}</h2>
        <p>
          {[event.date, event.venue, event.city, event.classification]
            .filter(Boolean)
            .join(" · ") || "Event details coming soon"}
        </p>
        <div className="card-actions mt-2">
          <Link className="btn btn-neutral btnoutline btn-sm shadow-lg" to={`/events/${event.id}`}>
            View details
          </Link>
          {showRegister && (
            <button
              className={`btn btn-sm shadow-lg ${isRegistered ? "btn-disabled" : "btn-primary"}`}
              disabled={isRegistered}
              aria-pressed={isRegistered}
              type="button"
              onClick={() => onRegister?.(event)}
            >
              {isRegistered ? "Registered" : "Register"}
            </button>
          )}
          {onCancel && (
            <button
              className="btn btn-outline btn-sm shadow-lg"
              type="button"
              onClick={() => onCancel(event.id)}
              aria-label={`Cancel registration for ${event.name}`}
            >
              Cancel registration
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange?: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const lastPage = Math.max(totalPages, 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-3 py-4"
      aria-label="Event pages"
    >
      <button
        type="button"
        className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md gap-1 transition-transform hover:-translate-x-1 disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onChange?.(page - 1)}
      >
        Previous
      </button>

      <div className="flex items-center gap-2 rounded-full border-2 border-solid border-neutral bg-base-100 px-4 py-1 shadow-md">
        <span className="text-sm font-semibold">Page</span>
        <span
          className="badge badge-accent badge-md font-bold tabular-nums"
          aria-current="page"
        >
          {page}
        </span>
        <span className="text-sm font-semibold opacity-70">of {lastPage}</span>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md gap-1 transition-transform hover:translate-x-1 disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => onChange?.(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
