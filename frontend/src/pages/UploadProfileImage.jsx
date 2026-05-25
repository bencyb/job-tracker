import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UploadProfileImage() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(
      user?.profile_image || ""
    );

  const [loading, setLoading] =
    useState(false);

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error(
        "Only image files allowed"
      );
      return;
    }

    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "Image must be under 2MB"
      );
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!image) {
      toast.error(
        "Please select an image"
      );
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "profile_image",
        image
      );

      const res = await API.put(
        "upload-profile-image/",
        formData,
        {
          headers: {
            "Content-Type":
            "multipart/form-data",
          },
        }
      );

      // Update localStorage
      const updatedUser = {
        ...user,
        profile_image:
          res.data.profile_image,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success(
        "Profile image updated"
      );

      navigate("/profile");

      window.location.reload();

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
            Upload Profile Image
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Preview */}
            <div className="flex flex-col items-center mb-6">

              <img
                src={
                  preview ||
                  "https://i.pravatar.cc/150"
                }
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
              />

            </div>

            {/* File Input */}
            <input
              type="file"
              accept="profile_image/*"
              onChange={handleImageChange}
              className="w-full mb-6"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-lg disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : "Upload Image"}
            </button>

          </form>

        </div>

      </div>

      <Footer />

    </div>
  );
}