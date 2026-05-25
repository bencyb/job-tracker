import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier) {
      toast.error("Username or email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("password-reset/", {
        identifier,
      });

      console.log("API Response:", res.data);
      
      toast.success(res.data.message || "Password reset token generated.");
      setToken(res.data.token || "");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error ||
          "Failed to generate password reset token"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Token copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Enter your username or email and a reset token will be generated.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-70"
          >
            {loading ? "Generating..." : "Generate Reset Token"}
          </button>
        </form>

        {token && (
          <div className="mt-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-sm text-green-900 dark:text-green-100">
            <p className="font-semibold mb-2">Your password reset token:</p>
            <div className="bg-white dark:bg-gray-900 p-3 rounded-lg mb-3 break-all font-mono text-xs border border-green-300 dark:border-green-600">
              {token}
            </div>
            <button
              type="button"
              onClick={copyToClipboard}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition mb-3"
            >
              {copied ? "✓ Copied!" : "Copy Token"}
            </button>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              1. Copy this token above
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              2. Go to the reset password page
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              3. Paste the token (not your username) and enter a new password
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Ready to reset?{' '}
          <Link to="/reset-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Go to Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}
