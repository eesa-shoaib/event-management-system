import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchEvents,
  setClassification,
  setKeyword,
  setPage,
} from "../../features/events/eventsSlice";
import { EventCard, Pagination } from "../../components/EventWidgets";
import { type EventItem } from "../../features/events/eventsSlice";
import { addRegistration } from "../../features/registrations/registrationsSlice";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "Music", label: "Music" },
  { value: "Sports", label: "Sports" },
  { value: "Arts & Theatre", label: "Arts" },
  { value: "Film", label: "Film" },
  { value: "Miscellaneous", label: "More" },
];

function CategoryTabs({ value, onChange, }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Event categories"
      className="flex flex-wrap justify-center gap-2 rounded-box"
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
            className={`btn btn-md rounded-full px-6 border-2 border-solid border-neutral ${isActive
              ? "btn-primary shadow-md"
              : "bg-base-200 font-semibold hover:bg-base-300"
              }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchBar({
  initialValue,
  onSearch,
}: {
  initialValue: string;
  onSearch: (keyword: string) => void;
}) {
  const [draft, setDraft] = useState(initialValue);

  return (
    <form
      role="search"
      className="flex flex-col gap-3 sm:flex-row sm:gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(draft.trim());
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
              onSearch("");
            }}
          >
            ✕
          </button>
        )}
      </label>
      <button
        type="submit"
        className="btn btn-primary w-full border-2 border-solid border-neutral shadow-md sm:w-auto"
      >
        Search
      </button>
    </form>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: 3 }).map((_, i) => (
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

  const userRegistration = useAppSelector((state) => state.registrations.items);

  const navigate = useNavigate();
  const location = useLocation();

  const [registrationMsg, setRegistrationMsg] = useState<string | null>(null,);


  const { items, status, error, keyword, classification, page, totalPages } =
    useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents({ keyword, classification, page }));
  }, [dispatch, keyword, classification, page]);

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
    const alreadyRegistered = userRegistration.some(
      (registration) =>
        registration.userId === currentUser.id &&
        registration.event.id === event.id

    );

    if (alreadyRegistered) return;

    dispatch(addRegistration({ userId: currentUser.id, event }));
    setRegistrationMsg(`You are registered for ${event.name}`);
  }

  const handleKeywordSearch = (newKeyword: string) => {
    dispatch(setKeyword(newKeyword));
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
        <SearchBar initialValue={keyword} onSearch={handleKeywordSearch} />
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
                isRegistered={userRegistration.some(
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
