import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Profile() {

  // User from localStorage
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Resume state
  const [resume, setResume] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle Delete Resume
  const handleDeleteResume = async () => {

    try {

      setDeleteLoading(true);

      await API.delete("delete-resume/");

      // Remove resume from UI
      setResume(null);

      toast.success("Resume deleted successfully");

    } catch (error) {

      console.log(error);

      toast.error("Failed to delete resume");

    } finally {

      setDeleteLoading(false);

    }
  };

  // Fetch stats + resume
  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await API.get("job/");

        setStats({
          applied: res.data.applied || 0,
          interview: res.data.interview || 0,
          offer: res.data.offer || 0,
          rejected: res.data.rejected || 0,
        });

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    const fetchResume = async () => {

      try {

        const res = await API.get("view-resume/");

        setResume(res.data.resume);

      } catch (error) {

        console.log(error);

        setResume(null);

      }
    };

    fetchStats();

    fetchResume();

  }, []);

  return (

    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <Navbar />

      <div className="max-w-5xl mx-auto w-full p-6 flex-1">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-8">
          My Profile
        </h1>

        {/* User Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* Profile Image */}
            <img
              src={
                user?.profile_image ||
                "https://i.pravatar.cc/120"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
            />

            {/* User Info */}
            <div className="space-y-3 text-center md:text-left">

              <div>
                <p className="text-sm text-gray-500">
                  Username
                </p>

                <h2 className="text-2xl font-semibold">
                  {user?.username || "No Username"}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="text-lg">
                  {user?.email || "No Email"}
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Job Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-6">
            Job Activity
          </h2>

          {loading ? (

            <div className="text-center text-lg">
              Loading...
            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Applied */}
              <div className="bg-indigo-100 dark:bg-indigo-900 p-5 rounded-xl text-center">

                <p className="text-gray-600 dark:text-gray-300">
                  Applied
                </p>

                <h3 className="text-4xl font-bold mt-2 text-indigo-700 dark:text-white">
                  {stats.applied}
                </h3>

              </div>

              {/* Interview */}
              <div className="bg-yellow-100 dark:bg-yellow-900 p-5 rounded-xl text-center">

                <p className="text-gray-600 dark:text-gray-300">
                  Interview
                </p>

                <h3 className="text-4xl font-bold mt-2 text-yellow-700 dark:text-white">
                  {stats.interview}
                </h3>

              </div>

              {/* Offer */}
              <div className="bg-green-100 dark:bg-green-900 p-5 rounded-xl text-center">

                <p className="text-gray-600 dark:text-gray-300">
                  Offer
                </p>

                <h3 className="text-4xl font-bold mt-2 text-green-700 dark:text-white">
                  {stats.offer}
                </h3>

              </div>

              {/* Rejected */}
              <div className="bg-red-100 dark:bg-red-900 p-5 rounded-xl text-center">

                <p className="text-gray-600 dark:text-gray-300">
                  Rejected
                </p>

                <h3 className="text-4xl font-bold mt-2 text-red-700 dark:text-white">
                  {stats.rejected}
                </h3>

              </div>

            </div>

          )}

        </div>

        {/* Resume Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">

          <h2 className="text-2xl font-semibold mb-6">
            Resume
          </h2>

          {resume ? (

            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* Resume Icon */}
              <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">

                <svg
                  className="w-12 h-12 text-red-600 dark:text-red-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 2a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 100 2H4a1 1 0 100-2V2z" />
                </svg>

              </div>

              {/* Resume Info */}
              <div className="flex-1">

                <h3 className="text-lg font-semibold mb-2">
                  Resume Uploaded
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have successfully uploaded your resume.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">

                  <a
                    href={resume}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded-lg font-medium"
                  >

                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>

                    Download Resume

                  </a>

                  <button
                    onClick={handleDeleteResume}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                  >

                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>

                    {deleteLoading ? "Deleting..." : "Delete"}

                  </button>

                </div>

              </div>

            </div>

          ) : (

            <div className="text-center py-10">

              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>

              <h3 className="text-lg font-semibold mb-2">
                No Resume Uploaded
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't uploaded a resume yet.
              </p>

            </div>

          )}

        </div>

        {/* Job Notes Quick Link */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mt-8">

          <h2 className="text-2xl font-semibold mb-4">
            Job Notes
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Keep interview notes and job-specific comments here.
          </p>

          <div className="flex gap-3">

            <Link
              to="/job-notes"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              View Notes
            </Link>

            <a
              href="/job-notes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg"
            >
              Open in new tab
            </a>

          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}