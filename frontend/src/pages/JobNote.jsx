import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JobNote() {

  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Fetch Notes
  useEffect(() => {

    fetchNotes();

  }, []);

  const fetchNotes = async () => {

    try {

      const res = await API.get("job-notes/");

      setNotes(res.data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to load notes");

    } finally {

      setLoading(false);

    }
  };

  // Add Note
  const handleAddNote = async () => {

    if (!noteInput.trim()) {
      return toast.error("Please enter a note");
    }

    try {

      setAdding(true);

      const res = await API.post(
        "job-notes/",
        {
          note: noteInput,
        }
      );

      // Add newest note at top
      setNotes([res.data, ...notes]);

      setNoteInput("");

      toast.success("Note added successfully");

    } catch (error) {

      console.log(error);

      toast.error("Failed to add note");

    } finally {

      setAdding(false);

    }
  };

  // Delete Note
  const handleDeleteNote = async (id) => {

    try {

      await API.delete(`job-notes/${id}/`);

      setNotes(
        notes.filter(
          (note) => note.id !== id
        )
      );

      toast.success("Note deleted");

    } catch (error) {

      console.log(error);

      toast.error("Failed to delete note");
    }
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-6">

        {/* Page Heading */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold mb-2">
            Job Notes
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Track interview updates and important job application notes.
          </p>

        </div>

        {/* Notes Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6">

          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-6">
            Interview Notes
          </h2>

          {/* Add Note */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">

            <input
              type="text"
              value={noteInput}
              onChange={(e) =>
                setNoteInput(e.target.value)
              }
              placeholder="Example: HR round completed"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleAddNote}
              disabled={adding}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add Note"}
            </button>

          </div>

          {/* Notes */}
          {loading ? (

            <div className="text-center text-lg py-10">
              Loading...
            </div>

          ) : notes.length > 0 ? (

            <div className="space-y-4">

              {notes.map((item) => (

                <div
                  key={item.id}
                  className="bg-gray-100 dark:bg-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between sm:items-start gap-4"
                >

                  {/* Note Content */}
                  <div className="flex-1">

                    <p className="text-lg break-words">
                      {item.note}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      handleDeleteNote(item.id)
                    }
                    className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg text-sm font-medium self-start"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-center py-12">

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
                No Notes Added
              </h3>

              <p className="text-gray-600 dark:text-gray-400">
                Add interview or job related notes here.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}