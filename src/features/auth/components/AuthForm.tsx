import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  authRequestFailed,
  authRequestStarted,
  clearAuthError,
  loginSucceeded,
  registerSucceeded,
} from "../authSlice";
import { loginDemoUser, registerDemoUser } from "../authService";

type AuthFormProps = {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const title = isRegister ? "Create Account" : "Sign in";
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearAuthError());
    dispatch(authRequestStarted());
    try {
      const user = isRegister
        ? await registerDemoUser(formData.name, formData.email, formData.password)
        : await loginDemoUser(formData.email, formData.password);
      dispatch(isRegister ? registerSucceeded(user) : loginSucceeded(user));
      const from = (location.state as { from?: { pathname?: string } } | null)?.from;
      navigate(from?.pathname ?? "/events", { replace: true });
    } catch (requestError) {
      dispatch(
        authRequestFailed(
          requestError instanceof Error
            ? requestError.message
            : "Authentication failed. Please try again.",
        ),
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit}
        className="card border-2 border-solid border-neutral bg-base-300 p-4 shadow-lg sm:p-8"
      >
        <div className="card-body">
          <h1 className="card-title text-2xl">{title}</h1>

          {isRegister && (
            <label className="form-control">
              <span className="label-text mb-2">Name</span>
              <input
                className="input input-neutral"
                name="name"
                autoComplete="name"
                placeholder="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-2">Password</span>

            <input
              className="input input-neutral"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              placeholder="StrongPass123!"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && (
            <p className="text-error" role="alert">
              {error}
            </p>
          )}
          <button className="btn btn-primary mt-2" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Please wait..." : title}
          </button>
          <p className="text-sm">
            {isRegister ? "Already registered?" : "Need an account?"}{" "}
            <Link className="link link-ghost" to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
