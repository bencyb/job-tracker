import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UpdateUsername() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [username, setUsername] = useState(
    user?.username || ""
  );

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    try {

      setLoading(true);

      const res = await API.put(
        "update-username/",
        {
          username,
        }
      );

      // Update localStorage
      const updatedUser = {
        ...user,
        username: res.data.username,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success(
        "Username updated successfully"
      );

      navigate("/profile");

      // Refresh navbar
      window.location.reload();

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.error ||
        "Failed to update username"
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
            Update Username
          </h1>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="New Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full p-3 rounded-lg border mb-5 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Updating..."
                : "Update Username"}
            </button>

          </form>

        </div>

      </div>

      <Footer />

    </div>
  );
}