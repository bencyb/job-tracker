import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">

      {/* Navbar-like header */}
      <div className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold tracking-wide">
          Job Tracker
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-extrabold leading-tight">
          Track Your Job Applications
          <br />
          <span className="text-blue-400">Smartly & Easily</span>
        </h2>

        <p className="mt-6 text-gray-300 max-w-xl">
          Manage all your job applications in one place. Stay organized, track progress,
          and never miss an opportunity again.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 px-10 pb-16">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold">Track Applications</h3>
          <p className="text-gray-400 mt-2 text-sm">
            Keep all your job applications organized in one dashboard.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold">Update Status</h3>
          <p className="text-gray-400 mt-2 text-sm">
            Easily update interview, rejected, or accepted status.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold">Stay Organized</h3>
          <p className="text-gray-400 mt-2 text-sm">
            Never lose track of opportunities again.
          </p>
        </div>
      </div>
    </div>
  );
}