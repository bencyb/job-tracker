import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`verify-email/${uidb64}/${token}/`);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        const errorMessage = err?.response?.data?.error || "Verification failed.";
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verify();
  }, [uidb64, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-4">Verify Email</h1>

        {status === "loading" ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">Verifying your email...</p>
        ) : (
          <>
            <p className={`text-sm ${status === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {message}
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
