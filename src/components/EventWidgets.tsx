import { Link } from "react-router-dom";

export interface EventInfo {
  id: string;
  name: string;
  date?: string;
  image?: string;
  venue?: string;
  city?: string;
  classification?: string;
}

interface EventFiltersProps {
  onSearch?: (keyword: string, classification: string) => void;
}

export function EventFilters({ onSearch }: EventFiltersProps) {
  function handleSubmit(formData: FormData) {
    onSearch?.(
      String(formData.get("keyword") ?? ""),
      String(formData.get("classification") ?? ""),
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      action={(formData) => handleSubmit(formData)}
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
      </select>
      <button className="btn btn-secondary border-2 border-double-neutral shadow-md" type="submit">
        Search
      </button>
    </form>
  );
}

interface EventCardProps {
  event: EventInfo;
  onRegister?: (event: EventInfo) => void;
  showRegister?: boolean;
}

export function EventCard({
  event,
  onRegister,
  showRegister = false,
}: EventCardProps) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm sm:card-side">
      {event.image && (
        <figure className="sm:max-w-56">
          <img src={event.image} alt="" className="h-48 w-full object-cover sm:h-full" />
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
          <Link className="btn btn-outline btn-sm" to={`/events/${event.id}`}>
            View details
          </Link>
          {showRegister && (
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => onRegister?.(event)}
            >
              Register
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
  return (
    <div className="join justify-center" aria-label="Event pages">
      <button
        className="join-item btn"
        type="button"
        disabled={page <= 1}
        onClick={() => onChange?.(page - 1)}
      >
        Previous
      </button>
      <span className="join-item btn btn-disabled">
        {page} / {Math.max(totalPages, 1)}
      </span>
      <button
        className="join-item btn"
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange?.(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
