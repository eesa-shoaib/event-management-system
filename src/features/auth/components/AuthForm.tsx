import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { loginSucceed, registerSucceeded } from "../authSlice";

type AuthFormProps = {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {

  const isRegistered = mode === "register";
  const title = isRegistered ? "Create Account" : "Sign in";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      name: formData.name || "Event User",
      email: formData.email,
    }

    isRegistered ? dispatch(registerSucceeded(mockUser)) : dispatch(loginSucceed(mockUser));

    navigate("/events");
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="card border-2 border-solid border-neutral shadow-lg bg-base-300  p-8">
        <div className="card-body">
          <h1 className="card-title text-2xl">{title}</h1>

          {isRegistered && (
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
          )
          }

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
              autoComplete={isRegistered ? "new-password" : "current-password"}
              minLength={8}
              placeholder="StrongPass123!"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btn btn-primary mt-2" type="submit">

            {title}

          </button>
          <p className="text-sm">

            {isRegistered ? "Already Registereded?" : "Need an account?"}{" "}

            <Link className="link link-ghost" to={isRegistered ? "/login" : "/register"}>
              {isRegistered ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
