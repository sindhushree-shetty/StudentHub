import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

import { db, storage } from "./firebase";

// ── NOTES ──

// Upload a PDF note and save its metadata
export async function uploadNote({
  file,
  classCode,
  subject,
  title,
  uploadedBy
}) {
  const fileRef = ref(
    storage,
    `notes/${classCode}/${Date.now()}_${file.name}`
  );

  await uploadBytes(fileRef, file);

  const fileUrl = await getDownloadURL(fileRef);

  const refDoc = await addDoc(collection(db, "notes"), {
    classCode,
    subject,
    title,
    fileUrl,
    uploadedBy,
    uploadedAt: Timestamp.now()
  });

  return refDoc.id;
}

// Get all notes belonging to one class
export async function getNotesForClass(classCode) {
  const q = query(
    collection(db, "notes"),
    where("classCode", "==", classCode)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Log whenever a student downloads a note
export async function logDownload({
  noteId,
  studentUid,
  studentName
}) {
  const refDoc = await addDoc(collection(db, "noteDownloads"), {
    noteId,
    studentUid,
    studentName,
    downloadedAt: Timestamp.now()
  });

  return refDoc.id;
}