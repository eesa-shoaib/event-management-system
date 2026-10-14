import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EventHero from "../../features/events/components/details/EventHero";
import EventMetadata from "../../features/events/components/details/EventMetadata";
import EventSchedule from "../../features/events/components/details/EventSchedule";
import VenueLocation from "../../features/events/components/details/VenueLocation";
import { fetchEventById, type EventItem } from "../../features/events/eventsSlice";
import { addRegistration } from "../../features/registrations/registrationsSlice";

function EventDetailSkeleton() {
  return (
    <article
      className="card border-2 border-solid border-neutral bg-base-200 shadow-md rounded-box"
      role="status"
      aria-busy="true"
      aria-label="Loading event"
    >
      <div className="card-body space-y-6">
        <header className="space-y-4">
          <div className="skeleton h-64 md:h-96 w-full rounded-box" />
          <div className="skeleton h-8 md:h-9 w-3/4" />
          <div className="skeleton h-8 md:h-9 w-1/2 md:hidden" />
        </header>

        <div className="divider my-0" />

        <section className="space-y-2">
          <div className="skeleton h-5 w-36" />
          <div className="skeleton h-4 w-2/3" />
        </section>

        <section className="space-y-2">
          <div className="skeleton h-5 w-40" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-4 w-3/4" />
        </section>

        <section className="space-y-2">
          <div className="skeleton h-5 w-28" />
          <div className="skeleton h-4 w-2/5" />
          <div className="mt-4">
            <div className="skeleton h-4 w-1/3" />
          </div>
        </section>
      </div>
    </article>
  );
}

export function EventDetailsPage() {
  const { id } = useParams();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const userRegistrations = useAppSelector((state) => state.registrations.items);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [registrationMsg, setRegistrationMsg] = useState<string | null>(null);
  const { activeEvent, detailStatus, detailError } = useAppSelector(
    (state) => state.events,
  );

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

  const isRegistered = Boolean(
    currentUser &&
    activeEvent &&
    userRegistrations.some(
      (registration) =>
        registration.userId === currentUser.id &&
        registration.event.id === activeEvent.id,
    ),
  );

  useEffect(() => {
    if (!registrationMsg) return;
    const timeoutId = window.setTimeout(() => setRegistrationMsg(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [registrationMsg]);

  useEffect(() => {
    if (id) dispatch(fetchEventById(id));
  }, [dispatch, id]);

  return (
    <section className="space-y-6 bg-base-300 px-6 py-8 md:px-8 border-2 border-neutral rounded-4xl shadow-lg">
      <Link
        to="/events"
        className="btn btn-ghost btn-sm w-fit gap-1 transition-transform hover:-translate-x-1"
      >
        <span aria-hidden="true">←</span> Back to events
      </Link>

      {detailStatus === "loading" && <EventDetailSkeleton />}

      {detailStatus === "failed" && (
        <div
          role="alert"
          className="alert alert-error flex-wrap border-2 border-solid border-neutral shadow-md rounded-box"
        >
          <span className="font-semibold">
            {detailError ?? "We couldn't load this event."}
          </span>
          {id && (
            <button
              type="button"
              className="btn btn-sm btn-primary border-2 border-solid border-neutral shadow-md"
              onClick={() => dispatch(fetchEventById(id))}
            >
              Try again
            </button>
          )}
        </div>
      )}

      {detailStatus === "succeeded" && activeEvent && (
        <article className="card border-2 border-solid border-neutral bg-base-200 shadow-md rounded-box">
          <div className="card-body space-y-6">
            <EventHero event={activeEvent} />
            <div className="divider my-0" />
            <EventSchedule event={activeEvent} />
            <VenueLocation event={activeEvent} />
            <EventMetadata event={activeEvent} />
            {registrationMsg && (
              <div className="toast toast-top toast-end z-[100] pointer-events-none">
                <div
                  className="alert alert-success pointer-events-auto border-2 border-solid border-neutral shadow-md rounded-box"
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
            <div className="card-actions">
              <button
                className={`btn ${isRegistered ? "btn-disabled" : "btn-primary"}`}
                type="button"
                disabled={isRegistered}
                aria-pressed={isRegistered}
                onClick={() => handleRegister(activeEvent)}
              >
                {isRegistered ? "Registered" : "Register"}
              </button>
            </div>
          </div>
        </article>
      )}

      {detailStatus === "succeeded" && !activeEvent && (
        <div className="card border-2 border-solid border-neutral bg-base-200 shadow-md">
          <div className="card-body items-center text-center">
            <span className="text-5xl" aria-hidden="true">🎫</span>
            <h2 className="card-title text-2xl">Event not found</h2>
            <p className="text-base-content/70">
              We couldn't find an event with ID{" "}
              <span className="font-mono font-bold">{id}</span>.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
