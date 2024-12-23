import { useEffect, useState } from "react";
import { INote } from "../../models/INote";
import { addNote, getNotesBySubject, uploadFile } from "../../api/notesApi";
import NoteCard from "./NoteCard";
import { useParams } from "react-router-dom";
import { Button, Alert, Spinner } from "react-bootstrap";
import AddNoteModal from "../common/AddNoteModal";
import { ISubject } from "../../models/ISubject";
import { getSubjects } from "../../api/subjectsApi";

const NoteList = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<INote[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]); // State to store subjects
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Fetch notes by subject
  const fetchNotes = async () => {
    if (subjectId) {
      setLoading(true);
      try {
        const allNotes = await getNotesBySubject(subjectId);
        setNotes(allNotes);
        setError(null); // Reset error if fetch is successful
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to load notes. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Subject ID is undefined");
    }
  };

  // Fetch subjects for the modal select
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      // Fetch subjects
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    } catch (error) {
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSubjects(); // Fetch subjects when component is mounted
  }, [subjectId]);

  // Modal actions
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (
    formData: { [key: string]: any },
    files: File[]
  ) => {
    console.log("Form Data Submitted:", formData);

    // Validate required fields
    if (!formData.title || !formData.subject || !formData.visibility) {
      setError("Title, subject, and visibility are required fields.");
      return;
    }

    try {
      // First, send the note data to the addNote endpoint
      const noteResponse = await addNote(formData);

      const noteId = noteResponse.data.noteId; // Assuming noteId is returned in the response

      if (files.length > 0) {
        // Upload each file with the noteId
        for (const file of files) {
          await uploadFile(file, noteId);
        }
        console.log("Files uploaded and associated with the note.");
      }

      setShowModal(false); // Close the modal after successful submission
      setError(null); // Reset error
      fetchNotes(); // Refresh the list of notes

      console.log("Note added successfully:", noteResponse.data);
    } catch (error: any) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <Button variant="primary" onClick={handleShowModal}>
          Add New Note
        </Button>
      </div>

      {showModal && (
        <AddNoteModal
          show={showModal}
          handleClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          subjects={subjects} // Pass the subjects to the modal
        />
      )}

      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center mt-3">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        {notes.length === 0 ? (
          <Alert variant="info">No notes found for this subject.</Alert>
        ) : (
          notes.map((note) => (
            <div className="flex-fill" key={note.id}>
              <NoteCard note={note} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default NoteList;
