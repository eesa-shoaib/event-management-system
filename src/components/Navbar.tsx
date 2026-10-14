import { Link, NavLink, useNavigate, type NavLinkProps } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { authRequestFailed, logout } from "../features/auth/authSlice";
import { clearSavedSession } from "../features/auth/authService";

const navLinkClass: NavLinkProps["className"] = ({ isActive }) =>
  `btn btn-md px-4
  transition-all duration-200
  ${isActive ? "btn-neutral shadow-md " : "btn-ghost hover:bg-neutral/30 hover:shadow-lg"}`;

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, currentUser, error } = useAppSelector((state) => state.auth);

  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLogout = () => {
    closeDropdown();
    try {
      clearSavedSession();
      dispatch(logout());
      navigate("/login");
    } catch (logoutError) {
      dispatch(
        authRequestFailed(
          logoutError instanceof Error
            ? logoutError.message
            : "Could not clear the saved session.",
        ),
      );
    }
  };

  return (
    <>
      <header className="navbar rounded-4xl border-2 border-solid border-neutral bg-base-300 px-3 py-3 shadow-lg sm:px-6 lg:px-8">
        <div className="navbar-start min-w-0">
          <Link to="/events" className="link link-base-content truncate text-lg font-bold sm:text-xl">
            Event Finder
          </Link>
        </div>

        <nav className="navbar-end hidden gap-1 sm:flex lg:gap-2" aria-label="Main navigation">
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
          <NavLink to="/my-events" className={navLinkClass}>
            My Events
          </NavLink>
          {isAuthenticated ? (
            <div className="dropdown dropdown-end">
              <button type="button" tabIndex={0} className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md">
                <span className="max-w-32 truncate">{currentUser?.name || "User"}</span>
                <span aria-hidden="true">▾</span>
              </button>
              <ul tabIndex={0} className="dropdown-content menu z-10 mt-2 w-40 rounded-box border-2 border-solid border-neutral bg-base-200 p-2 shadow-lg">
                <li><button type="button" onClick={handleLogout}>Log out</button></li>
              </ul>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>Sign in</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md">Sign up</NavLink>
            </>
          )}
        </nav>

        <div className="navbar-end sm:hidden">
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-primary btn-sm border-2 border-solid border-neutral shadow-md"
              aria-label="Open navigation menu"
            >
              Menu <span aria-hidden="true">☰</span>
            </button>
            <ul tabIndex={0} className="dropdown-content menu z-10 mt-2 w-48 rounded-box border-2 border-solid border-neutral bg-base-200 p-2 shadow-lg">
              <li><Link to="/events" onClick={closeDropdown}>Events</Link></li>
              <li><Link to="/my-events" onClick={closeDropdown}>My Events</Link></li>
              {isAuthenticated ? (
                <li><button type="button" onClick={handleLogout}>Log out</button></li>
              ) : (
                <>
                  <li><Link to="/login" onClick={closeDropdown}>Sign in</Link></li>
                  <li><Link to="/register" onClick={closeDropdown}>Sign up</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      {error && <p className="mt-2 text-sm text-error" role="alert">{error}</p>}
    </>
  );
}

export default Navbar;
