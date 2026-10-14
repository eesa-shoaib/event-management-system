import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EventCard } from "../../components/EventWidgets";
import {
  cancelRegistration,
  type Registration,
} from "../../features/registrations/registrationsSlice";

export default function MyEventsPage() {

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const registrations = useAppSelector((state) => state.registrations.items);

  const [today] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}`;
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timeoutId = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const myRegistrations = registrations.filter(
    (registration) => registration.userId === currentUser?.id,
  );

  const upcoming = myRegistrations
    .filter((registration) => !registration.event.date || registration.event.date >= today)
    .sort((a, b) => (a.event.date ?? "").localeCompare(b.event.date ?? ""));

  const completed = myRegistrations
    .filter((registration) => registration.event.date && registration.event.date < today)
    .sort((a, b) => (b.event.date ?? "").localeCompare(a.event.date ?? ""));

  function handleCancel(eventId: string) {
    if (!currentUser) return;
    const registration = myRegistrations.find(
      (item) => item.event.id === eventId,
    );
    if (!registration) return;

    dispatch(cancelRegistration({ userId: currentUser.id, eventId }));
    setFeedback(`Registration for ${registration.event.name} cancelled.`);
  }

  return (
    <section className="space-y-6 rounded-4xl border-2 border-neutral bg-base-300 px-6 py-8 shadow-lg md:px-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">My events</h1>
        <p className="mt-2 text-base-content/70">
          Keep track of the events you have registered for.
        </p>
      </header>

      {feedback && (
        <div className="toast toast-top toast-end z-[100] pointer-events-none">
          <div
            className="alert alert-success pointer-events-auto border-2 border-solid border-neutral shadow-md rounded-box"
            role="status"
            aria-live="polite"
          >
            <span className="font-semibold">{feedback}</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              aria-label="Dismiss cancellation confirmation"
              onClick={() => setFeedback(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {myRegistrations.length === 0 ? (
        <div className="card border-2 border-solid border-neutral bg-base-200 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-error text-2xl">No registered events yet</h2>
            <p className="text-base-content/70">
              Find an event you like and register to see it here.
            </p>
            <Link className="btn btn-primary mt-2" to="/events">
              Browse events
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <EventGroup
            title="Upcoming events"
            emptyMessage="You have no upcoming events."
            registrations={upcoming}
            onCancel={handleCancel}
          />
          <EventGroup
            title="Past events"
            emptyMessage="Your past events will appear here."
            registrations={completed}
            onCancel={handleCancel}
          />
        </div>
      )}
    </section>
  );
}

function EventGroup({ title, emptyMessage, registrations, onCancel, }: {
  title: string;
  emptyMessage: string;
  registrations: Registration[];
  onCancel: (eventId: string) => void;
}) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {registrations.length === 0 ? (
        <p className="rounded-box border-2 border-neutral bg-base-200 p-4 text-base-content/70">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {registrations.map((registration) => (
            <EventCard
              key={`${registration.userId}-${registration.event.id}`}
              event={registration.event}
              onCancel={onCancel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
