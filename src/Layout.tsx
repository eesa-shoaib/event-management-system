import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full px-4 py-4 sm:px-8">
        <Navbar />
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 px-10 py-6 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
