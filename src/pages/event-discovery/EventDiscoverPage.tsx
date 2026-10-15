import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchEvents,
  setClassification,
  setEventDate,
  setKeyword,
  setPage,
} from "../../features/events/eventsSlice";
import { EventCard, Pagination } from "../../components/EventWidgets";
import type { EventItem } from "../../features/events/eventsSlice";
import { addRegistration } from "../../features/registrations/registrationsSlice";

const CATEGORIES = [
  { value: "", label: "All", icon: "all" },
  { value: "Music", label: "Music", icon: "music" },
  { value: "Sports", label: "Sports", icon: "sports" },
  { value: "Arts & Theatre", label: "Arts", icon: "arts" },
  { value: "Film", label: "Film", icon: "film" },
  { value: "Miscellaneous", label: "More", icon: "more" },
];

function CategoryIcon({ name }: { name: string }) {
  const commonProps = {
    className: "h-4 w-4 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "music":
      return <svg {...commonProps}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
    case "sports":
      return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="m8.5 4 3.5 4 4-1 3 4-2 5-5 1-3-4-4 1-2-4 2-4Z" /></svg>;
    case "arts":
      return <svg {...commonProps}><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1.4-3.4 1.9 1.9 0 0 1 1.3-3.3H18a3 3 0 0 0 3-3c0-4.6-4-8.3-9-8.3Z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7.5" r="1" /><circle cx="15" cy="8" r="1" /></svg>;
    case "film":
      return <svg {...commonProps}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4" /></svg>;
    case "more":
      return <svg {...commonProps}><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></svg>;
    default:
      return <svg {...commonProps}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
  }
}

function CategoryTabs({ value, onChange, }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Event categories"
      className="flex flex-wrap justify-center gap-3 rounded-box"
    >
      {CATEGORIES.map((cat) => {
        const isActive = value === cat.value;
        return (
          <button
            key={cat.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.value)}
            className={`btn btn-md gap-2 rounded-full px-5 border-2 border-solid border-neutral ${isActive
              ? "btn-primary shadow-md"
              : "bg-base-200 font-semibold hover:bg-base-300"
              }`}
          >
            <CategoryIcon name={cat.icon} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchBar({
  initialValue,
  initialEventDate,
  onSearch,
}: {
  initialValue: string;
  initialEventDate: string;
  onSearch: (keyword: string, eventDate: string) => void;
}) {
  const [draft, setDraft] = useState(initialValue);
  const [draftEventDate, setDraftEventDate] = useState(initialEventDate);
  const [dateError, setDateError] = useState<string | null>(null);
  const [minimumDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;
  });

  return (
    <form
      role="search"
      className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (draftEventDate && draftEventDate < minimumDate) {
          setDateError("Choose today or a future date.");
          return;
        }
        setDateError(null);
        onSearch(draft.trim(), draftEventDate);
      }}
    >
      <label className="input input-bordered flex flex-1 items-center border-2 border-solid border-neutral bg-base-100 shadow-md">
        <input
          type="search"
          className="grow"
          placeholder="Search by name, artist, or team"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Search events"
        />
        {draft && (
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            aria-label="Clear search"
            onClick={() => {
              setDraft("");
              onSearch("", draftEventDate);
            }}
          >
            ✕
          </button>
        )}
      </label>
      <label className="form-control">
        <input
          className="input input-bordered w-full border-2 border-solid border-neutral bg-base-100 shadow-md"
          type="date"
          value={draftEventDate}
          min={minimumDate}
          onChange={(e) => {
            setDraftEventDate(e.target.value);
            setDateError(null);
          }}
          aria-label="Event date"
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary w-full border-2 border-solid border-neutral shadow-md"
      >
        Search
      </button>
      {dateError && (
        <div
          className="alert alert-error border-2 border-solid border-neutral shadow-md rounded-box sm:col-span-2 lg:col-span-3"
          role="alert"
        >
          <span>{dateError}</span>
        </div>
      )}
    </form>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="card border-2 border-solid border-neutral bg-base-200 shadow-md sm:card-side rounded-4xl"
        >
          <div className="skeleton h-36 w-full shrink-0 rounded-t-4xl sm:h-36 sm:w-44 sm:rounded-l-4xl sm:rounded-tr-none" />
          <div className="card-body space-y-3">
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EventDiscoveryPage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const userRegistrations = useAppSelector((state) => state.registrations.items);
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationMsg, setRegistrationMsg] = useState<string | null>(null);
  const {
    items,
    status,
    error,
    keyword,
    classification,
    eventDate,
    page,
    totalPages,
  } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents({ keyword, classification, page, eventDate }));
  }, [dispatch, keyword, classification, page, eventDate]);

  useEffect(() => {
    if (!registrationMsg) return;
    const timeoutId = window.setTimeout(() => setRegistrationMsg(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [registrationMsg]);

  const handleRegister = (event: EventItem) => {
    if (!currentUser) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const alreadyRegistered = userRegistrations.some(
      (registration) =>
        registration.userId === currentUser.id &&
        registration.event.id === event.id,
    );
    if (alreadyRegistered) return;

    dispatch(addRegistration({ userId: currentUser.id, event }));
    setRegistrationMsg(`You are registered for ${event.name}.`);
  };

  const handleSearch = (newKeyword: string, newEventDate: string) => {
    dispatch(setKeyword(newKeyword));
    dispatch(setEventDate(newEventDate));
    dispatch(setPage(0));
  };

  const handleCategoryChange = (newClassification: string) => {
    dispatch(setClassification(newClassification));
    dispatch(setPage(0));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage - 1));
  };

  return (
    <section className="space-y-6 bg-base-300 px-6 py-8 md:px-8 border-2 border-neutral rounded-4xl shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Find events</h1>
        {registrationMsg && (
          <div className="toast toast-top toast-end z-[100] pointer-events-none">
            <div
              className="alert alert-success pointer-events-auto border-2 border-solid border-neutral text-left shadow-md rounded-box"
              role="status"
              aria-live="polite"
            >
              <span className="font-semibold">{registrationMsg}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-label="Dismiss registration confirmation"
                onClick={() => setRegistrationMsg(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <p className="mt-2 text-base-content/70">
          Search by name or browse by category.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <CategoryTabs value={classification} onChange={handleCategoryChange} />
        </div>
        <SearchBar
          initialValue={keyword}
          initialEventDate={eventDate}
          onSearch={handleSearch}
        />
      </div>

      {status === "loading" && <ResultsSkeleton />}

      {status === "failed" && (
        <div
          role="alert"
          className="alert alert-error border-2 border-solid border-neutral shadow-md rounded-box"
        >
          <span className="font-semibold">
            {error ?? "Something went wrong. Please try again."}
          </span>
        </div>
      )}

      {status === "succeeded" && items.length === 0 && (
        <div className="card border-2 border-solid border-neutral bg-base-200 shadow-md">
          <div className="card-body items-center text-center">
            <span className="text-5xl" aria-hidden="true">🔎</span>
            <h2 className="card-title text-2xl">No events found</h2>
            <p className="text-base-content/70">
              Try a different keyword or pick another category.
            </p>
          </div>
        </div>
      )}

      {status === "succeeded" && items.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            {items.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showRegister
                isRegistered={userRegistrations.some(
                  (registration) =>
                    registration.userId === currentUser?.id &&
                    registration.event.id === event.id,
                )}
                onRegister={handleRegister}
              />
            ))}
          </div>
          <Pagination
            page={page + 1}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}

export default EventDiscoveryPage;
