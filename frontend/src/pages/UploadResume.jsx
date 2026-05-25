import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { toast } from "react-toastify";

export default function UploadResume() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [resume, setResume] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // Validate PDF
    if (file.type !== "application/pdf") {
      toast.error(
        "Only PDF files allowed"
      );
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!resume) {
      toast.error(
        "Please select a resume"
      );
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "resume",
        resume
      );

      const res = await API.put(
        "upload-resume/",
        formData
      );

      // Update localStorage
      const updatedUser = {
        ...user,
        resume: res.data.resume,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success(
        "Resume uploaded successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.error ||
        "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <Navbar />

      <div className="max-w-xl mx-auto w-full p-6 flex-1">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">

          <h1 className="text-3xl font-bold mb-6">
            Upload Resume
          </h1>

          <form onSubmit={handleSubmit}>

            {/* File Input */}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full mb-6"
            />

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </form>

          {/* View Resume */}
          {user?.resume && (

            <div className="mt-6">

              <a
                href={user.resume}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                View Uploaded Resume
              </a>

            </div>

          )}

        </div>

      </div>

      <Footer />

    </div>
  );
}