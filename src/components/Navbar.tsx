import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const navLinkClass = ({ isActive }) =>
  `btn btn-md px-4
  transition-all duration-200
  ${isActive ? "btn-neutral shadow-md " : "btn-ghost hover:bg-neutral/30 hover:shadow-lg"}`;

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser } = useAppSelector((state) => state.auth);

  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLogout = () => {
    closeDropdown();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar bg-base-300 border-2 border-solid border-neutral shadow-lg px-16 py-4 rounded-4xl">
      <div className="navbar-start">
        <Link to="/events" className="link link-base-content text-lg font-bold">
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

        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md"
            >
              {currentUser?.name || "User"}
              <svg className="w-3 h-3" viewBox="0 0 10 6" fill="currentColor" aria-hidden="true">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box z-10 mt-2 w-40 p-2 shadow-lg border-2 border-solid border-neutral"
            >
              <li>
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md"
            >
              Log in
              <svg className="w-3 h-3" viewBox="0 0 10 6" fill="currentColor" aria-hidden="true">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-40 p-2 shadow-lg border-2 border-solid border-neutral"
            >
              <li>
                <Link to="/login" onClick={closeDropdown}>
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeDropdown}>
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
