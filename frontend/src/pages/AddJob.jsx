import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

export default function AddJob() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("applications/", {
        company,
        position,
        status,
        notes,
      });
      toast.success("Job added successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding job:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">

      {/* HEADER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Add New Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Company */}
            <div>
              <label className="text-sm text-gray-600">Company</label>
              <input
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="text-sm text-gray-600">Position</label>
              <input
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter job position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <select
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-gray-600">Notes</label>
              <textarea
                className="w-full mt-1 px-4 py-2 border rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium"
            >
              {loading ? "Adding..." : "Add Job"}
            </button>

          </form>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}