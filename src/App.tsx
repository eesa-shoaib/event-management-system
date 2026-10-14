import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import {
  MyEventsPage
} from "./pages/SimplePages";
import LoginPage from "./pages/login/LoginPage";
import EventDiscoveryPage from "./pages/event-discovery/EventDiscoverPage";
import RegisterPage from "./pages/register/RegisterPage";
import { EventDetailsPage } from "./pages/event-details/EventDetailsPage";
import Layout from "./Layout";

function RequireAuth() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100 text-base-content">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/events" element={<EventDiscoveryPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/my-events" element={<MyEventsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
