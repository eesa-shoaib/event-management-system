import { Link } from "react-router-dom";

type AuthFormProps = {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegistered = mode === "register";
  const title = isRegistered ? "Create Account" : "Sign in";
  return (
    <section className="mx-auto w-full max-w-md">
      <form className="card border-2 border-solid border-neutral shadow-lg bg-base-300  p-8">
        <div className="card-body">
          <h1 className="card-title text-2xl">{title}</h1>
          {isRegistered && (
            <label className="form-control">
              <span className="label-text mb-2">Name</span>
              <input className="input input-neutral" name="name" autoComplete="name" placeholder="name" required />
            </label>
          )}
          <label className="form-control">
            <span className="label-text mb-2">Email</span>
            <input
              className="input input-neutral"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="event.find@gmail.dev"
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-2">Password</span>

            <input
              className="input input-neutral"
              name="password"
              type="password"
              autoComplete={isRegistered ? "new-password" : "current-password"}
              minLength={8}
              placeholder="StrongPass123!"
              required
            />
          </label>

          <button className="btn btn-primary mt-2" type="submit" disabled>

            {title}

          </button>
          <p className="text-sm">
            {isRegistered ? "Already isRegistereded?" : "Need an account?"}{" "}
            <Link className="link link-ghost" to={isRegistered ? "/login" : "/register"}>
              {isRegistered ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
