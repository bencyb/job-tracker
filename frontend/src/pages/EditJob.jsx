import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load job details
  const loadJob = async () => {
    try {
      const res = await API.get(`applications/${id}/`);
      setCompany(res.data.company);
      setPosition(res.data.position);
      setStatus(res.data.status);
      setNotes(res.data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJob();
  }, []);

  // Update job
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await API.put(`applications/${id}/`, {
        company,
        position,
        status,
        notes,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Edit Job
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">

            {/* Company */}
            <div>
              <label className="text-sm text-gray-600">Company</label>
              <input
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Position */}
            <div>
              <label className="text-sm text-gray-600">Position</label>
              <input
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={updating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium"
            >
              {updating ? "Updating..." : "Update Job"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}