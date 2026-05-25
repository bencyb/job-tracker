import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobChart from "../components/JobChart";
import { toast } from "react-toastify";

export default function Dashboard() {

  const [jobs, setJobs] = useState([]);

  // Search + Filter + Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // User
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  // Load theme
  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const res = await API.get("applications/");
      setJobs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete Job
  const deleteJob = async (id) => {
  try {
      await API.delete(`applications/${id}/`);

      fetchJobs();
      setCurrentPage(1);

      toast.success("Job deleted successfully");

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job");
    }
  };

  // Search + Filter
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedJobs = [...filteredJobs].sort((a, b) => {

    if (sortBy === "Latest") {
      return b.id - a.id;
    }

    if (sortBy === "Oldest") {
      return a.id - b.id;
    }

    if (sortBy === "Company") {
      return a.company.localeCompare(b.company);
    }

    return 0;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = sortedJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const totalPages = Math.ceil(
    sortedJobs.length / jobsPerPage
  );

  // Stats
  const total = jobs.length;

  const applied = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interview = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offer = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  // Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Interview":
        return "bg-yellow-100 text-yellow-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">

      <Navbar />

      <div className="max-w-7xl mx-auto w-full p-6">

        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        {/* Welcome */}
        <h1 className="text-3xl font-bold">
          Welcome, {username || "User"}
        </h1>

        {/* Chart */}
        <div className="mt-6">
          <JobChart
            applied={applied}
            interview={interview}
            offer={offer}
            rejected={rejected}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mt-8 mb-8">

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">Total: {total}</div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">Applied: {applied}</div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">Interview: {interview}</div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">Offer: {offer}</div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">Rejected: {rejected}</div>

        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">Job Dashboard</h2>

          <Link to="/add">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
              + Add Job
            </button>
          </Link>

        </div>

        {/* Search + Filter + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Latest">Latest</option>
            <option value="Oldest">Oldest</option>
            <option value="Company">Company Name</option>
          </select>

        </div>

        {/* Job Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow"
            >
              <h2 className="text-xl font-bold">{job.company}</h2>
              <p className="text-gray-500 dark:text-gray-300">
                {job.position}
              </p>

              <span className={`inline-block mt-3 px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
                {job.status}
              </span>

              <div className="flex justify-between mt-5">

                <Link to={`/edit/${job.id}`}>
                  <button className="bg-blue-500 text-white px-3 py-2 rounded-lg">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => deleteJob(job.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">

          <button
            onClick={() =>
              setCurrentPage((p) => (p > 1 ? p - 1 : p))
            }
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) =>
                p < totalPages ? p + 1 : p
              )
            }
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Next
          </button>

        </div>

      </div>

      <Footer />

    </div>
  );
}