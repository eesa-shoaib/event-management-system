import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-8 lg:px-12">
        <Navbar />
      </div>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
