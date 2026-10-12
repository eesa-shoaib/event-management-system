import { Link, useParams } from "react-router-dom";
import { EventFilters } from "../components/EventWidgets";

export function EventDiscoveryPage() {
  return (
    <section className="space-y-6 bg-base-300 px-8 py-8 border-2 border-double-neutral rounded-4xl">
      <div>
        <h1 className="text-3xl font-bold">Find events</h1>
        <p className="mt-2 text-base-content/70">
          Search events by name or category.
        </p>
      </div>
      <EventFilters />
      <div className="alert">
        <span>Connect the Ticketmaster API to show event results here.</span>
      </div>
    </section>
  );
}

export function EventDetailsPage() {
  const { id } = useParams();

  return (
    <section className="space-y-5">
      <Link className="link" to="/events">
        Back to events
      </Link>
      <div>
        <h1 className="text-3xl font-bold">Event details</h1>
        <p className="mt-2 text-base-content/70">Event ID: {id}</p>
      </div>
      <div className="card border border-base-300 bg-base-100">
        <div className="card-body">
          <p>Connect the Ticketmaster API to load event information.</p>
          <button className="btn btn-primary w-fit" type="button" disabled>
            Register
          </button>
        </div>
      </div>
    </section>
  );
}

function AuthPage({ register = false }: { register?: boolean }) {
  const title = register ? "Create account" : "Log in";

  return (
    <section className="mx-auto w-full max-w-md">
      <form className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h1 className="card-title text-2xl">{title}</h1>
          {register && (
            <label className="form-control">
              <span className="label-text mb-2">Name</span>
              <input className="input input-bordered" name="name" autoComplete="name" required />
            </label>
          )}
          <label className="form-control">
            <span className="label-text mb-2">Email</span>
            <input
              className="input input-bordered"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-2">Password</span>
            <input
              className="input input-bordered"
              name="password"
              type="password"
              autoComplete={register ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </label>
          <button className="btn btn-primary mt-2" type="submit" disabled>
            {title}
          </button>
          <p className="text-sm">
            {register ? "Already registered?" : "Need an account?"}{" "}
            <Link className="link link-primary" to={register ? "/login" : "/register"}>
              {register ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}

export function LoginPage() {
  return <AuthPage />;
}

export function RegisterPage() {
  return <AuthPage register />;
}

export function MyEventsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">My Events</h1>
      <div className="alert">
        <span>Your registered events will appear here.</span>
      </div>
    </section>
  );
}
