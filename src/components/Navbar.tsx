import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `btn btn-md px-4
  transition-all duration-200
  ${isActive ? "btn-neutral shadow-md " : "btn-ghost hover:bg-neutral/30 hover:shadow-lg"}`;

function Navbar() {
  return (
    <header className="navbar bg-base-300 border-2 border-solid border-neutral shadow-lg px-16 py-4 rounded-4xl">
      <div className="navbar-start">
        <Link to="/events" className="link link-neutral text-lg font-bold">
          Event Finder
        </Link>
      </div>
      <nav className="navbar-end gap-2" aria-label="Main navigation">
        <NavLink to="/events" className={navLinkClass}>
          Events
        </NavLink>
        <NavLink to="/my-events" className={navLinkClass}>
          My Events
        </NavLink>
        <NavLink to="/login" className={navLinkClass}>
          Log in
        </NavLink>
        <NavLink to="/register" className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md">
          Sign up
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
