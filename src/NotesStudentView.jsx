import { useEffect, useState } from "react";
import {
  getNotesForClass,
  logDownload,
} from "./notesService";

export default function NotesStudentView({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);

      const data = await getNotesForClass(user.classCode);

      setNotes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    }

    setLoading(false);
  }

  async function handleDownload(note) {
    try {
      await logDownload({
        noteId: note.id,
        studentUid: user.uid,
        studentName: user.name,
      });

      window.open(note.fileUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to download note.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          📄 Class Notes
        </h2>

        <p className="text-gray-500 mb-8">
          Download notes shared by your teacher.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            Loading notes...
          </div>
                  ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            No notes available for your class.
          </div>
        ) : (
          <div className="grid gap-5">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      📄 {note.title}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      Subject:
                      <span className="font-medium">
                        {" "}
                        {note.subject}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Uploaded:
                      {" "}
                      {note.uploadedAt?.toDate
                        ? note.uploadedAt.toDate().toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(note)}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-white font-semibold hover:opacity-90"
                  >
                    ⬇ Download
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}