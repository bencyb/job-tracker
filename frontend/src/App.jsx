import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import UpdateUsername from "./pages/UpdateUsername";
import ChangePassword from "./pages/ChangePassword";
import UploadProfileImage from "./pages/UploadProfileImage";
import UploadResume from "./pages/UploadResume";
import JobNote from "./pages/JobNote";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddJob />} />
        <Route path="/edit/:id" element={<EditJob />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/username" element={<UpdateUsername />} />
        <Route path="/profile/password" element={<ChangePassword />} />
        <Route path="/profile/image" element={<UploadProfileImage />} />
        <Route path="/profile/resume" element={<UploadResume />} />
        <Route path="/job-notes" element={<JobNote />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}