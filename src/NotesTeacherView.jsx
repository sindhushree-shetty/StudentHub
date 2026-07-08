import { useEffect, useState } from "react";
import {
  uploadNote,
  getNotesForClass,
} from "./notesService";

export default function NotesTeacherView({ user }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const [notes, setNotes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      setLoadingNotes(true);

      const data = await getNotesForClass(user.classCode);

      setNotes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    }

    setLoadingNotes(false);
  }

  async function handleUpload(e) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!title.trim()) {
      setError("Please enter note title.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter subject.");
      return;
    }

    if (!file) {
      setError("Please choose a PDF file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    try {
      setLoading(true);

      await uploadNote({
        file,
        classCode: user.classCode,
        subject,
        title,
        uploadedBy: user.uid,
      });

      setSuccess("Note uploaded successfully.");

      setTitle("");
      setSubject("");
      setFile(null);

      document.getElementById("noteFile").value = "";

      await loadNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to upload note.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          📄 Upload Notes
        </h2>

        <p className="text-gray-500 mb-8">
          Upload PDF notes for your class.
        </p>

        {success && (
          <div className="mb-4 rounded-xl bg-green-100 text-green-700 px-4 py-3">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload}>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Note Title
            </label>

            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-5">
            <label className="block font-semibold mb-2">
              Subject
            </label>

            <input
              type="text"
              placeholder="Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">
              PDF File
            </label>

            <input
              id="noteFile"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 font-semibold hover:opacity-90"
          >
            {loading ? "Uploading..." : "Upload Note"}
          </button>

        </form>

      </div>

      <div className="mt-10">

        <h3 className="text-2xl font-bold mb-6">
          Uploaded Notes
        </h3>
                {loadingNotes ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            No notes uploaded yet.
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
                    <h4 className="text-xl font-semibold text-gray-800">
                      📄 {note.title}
                    </h4>

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

                  <div>
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-indigo-500 px-5 py-3 text-white font-semibold hover:bg-indigo-600"
                    >
                      View PDF
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}