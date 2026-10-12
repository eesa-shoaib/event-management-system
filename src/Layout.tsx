import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout() {

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 w-full px-4 sm:px-8 lg:px-40 py-4">
        <Navbar />
      </div>

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-80 py-6">
        <Outlet />
      </main>

    </div >
  )
}
