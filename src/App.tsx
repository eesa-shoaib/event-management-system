import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  EventDetailsPage,
  EventDiscoveryPage,
  MyEventsPage
} from "./pages/SimplePages";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import Layout from "./Layout";

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
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
