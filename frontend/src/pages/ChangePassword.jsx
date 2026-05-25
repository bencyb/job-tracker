import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

  const navigate = useNavigate();

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validation
    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {

      setLoading(true);

      await API.put(
        "change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        }
      );

      toast.success(
        "Password changed successfully"
      );

      // Logout after password change
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      navigate("/login");

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.error ||
        "Failed to change password"
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
            Change Password
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Old Password */}
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(e.target.value)
              }
              className="w-full p-3 rounded-lg border mb-4 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* New Password */}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full p-3 rounded-lg border mb-4 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full p-3 rounded-lg border mb-6 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>

        </div>

      </div>

      <Footer />

    </div>
  );
}