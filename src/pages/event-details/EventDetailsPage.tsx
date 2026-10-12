import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EventHero from "../../features/events/components/details/EventHero";
import EventMetadata from "../../features/events/components/details/EventMetadata";
import EventSchedule from "../../features/events/components/details/EventSchedule";
import VenueLocation from "../../features/events/components/details/VenueLocation";
import { fetchEventById } from "../../features/events/eventsSlice";

function EventDetailSkeleton() {
  return (
    <div className="card border-2 border-solid border-neutral bg-base-200 shadow-md">
      <div className="card-body space-y-6" aria-busy="true" aria-label="Loading event">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="skeleton h-64 w-full rounded-box" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-10 w-3/4" />
            <div className="flex gap-2">
              <div className="skeleton h-8 w-32 rounded-full" />
              <div className="skeleton h-8 w-28 rounded-full" />
            </div>
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
        <div className="skeleton h-40 w-full rounded-box" />
        <div className="skeleton h-40 w-full rounded-box" />
      </div>
    </div>
  );
}

export function EventDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { activeEvent, detailStatus, detailError } = useAppSelector(
    (state) => state.events,
  );

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
