import { useEffect, useState } from "react";
import { INote, Visibility } from "../../models/INote";
import { addNote, getNotesBySubject } from "../../api/notesApi";
import NoteCard from "./NoteCard";
import { useParams } from "react-router-dom";
import { Button, Alert, Spinner } from "react-bootstrap";
import AddModal from "../common/AddModal";

// Define types for the modal config and form data
interface NoteFormConfig {
  title: string;
  submitButtonText: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "radio";
    required?: boolean;
    options?: string[];
  }[];
}

const NoteList = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<NoteFormConfig | null>(null);

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

  useEffect(() => {
    fetchNotes();
  }, [subjectId]);

  // Modal actions
  const handleShowModal = (config: NoteFormConfig) => {
    setModalConfig(config);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (formData: { [key: string]: any }) => {
    console.log("Form Data Submitted:", formData);

    // Validate required fields
    if (!formData.title || !formData.subject || !formData.visibility) {
      setError("Title, subject, and visibility are required fields.");
      return;
    }

    try {
      await addNote(formData); // Submit the form data

      setShowModal(false);
      setError(null);
      console.log("Note added successfully");
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  // Define the note form configuration
  const noteFormConfig: NoteFormConfig = {
    title: "Add New Note",
    submitButtonText: "Add Note",
    fields: [
      { name: "title", label: "Note Title", type: "text", required: true },
      { name: "description", label: "Note Description", type: "textarea" },
      {
        name: "subject",
        label: "Subject",
        type: "select",
        required: true,
      },
      {
        name: "visibility",
        label: "Visibility",
        type: "radio",
        options: ["public", "hidden"],
        required: true,
      },
    ],
  };

  return (
    <>
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="primary"
          onClick={() => handleShowModal(noteFormConfig)}
        >
          Add New Note
        </Button>
      </div>

      {modalConfig && (
        <AddModal
          show={showModal}
          handleClose={handleCloseModal}
          formConfig={modalConfig}
          onSubmit={handleFormSubmit}
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
