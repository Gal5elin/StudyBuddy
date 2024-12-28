import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Auth/UserContext";
import { logout } from "../api/authApi";
import InfoCard from "./common/InfoCard";
import { INote } from "../models/INote";
import {
  deleteNote,
  getNoteByUser,
  updateNote,
  uploadFile,
} from "../api/notesApi";
import NoteCardSmall from "./Notes/NoteCardSmall";
import EditNoteModal from "./common/EditNoteModal";
import { getSubjects } from "../api/subjectsApi";
import { ISubject } from "../models/ISubject";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, setUser } = useUser();
  const [info, setInfo] = useState<{
    type: "ok" | "error" | "warning";
    title: string;
    description: string;
    link?: string;
    choice?: boolean;
    onClose?: (choice: boolean) => void;
  } | null>(null);

  const [loggedOut, setLoggedOut] = useState(false);
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<INote | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const data = await getNoteByUser();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoadingNotes(false);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    if (!loading && !user && !loggedOut) {
      navigate("/login");
    }
    if (user) {
      fetchSubjects();
      fetchNotes();
    }
  }, [user, loggedOut]);

  const handleLogout = () => {
    setInfo({
      type: "warning",
      title: "Logging Out",
      description: "You have been successfully logged out.",
    });
    logout();
    setLoggedOut(true);
  };

  const handleCloseInfoCard = () => {
    if (info?.type === "warning") {
      setInfo(null);
      setUser(null);
      navigate("/");
    }
    if (info?.choice === true) {
      handleConfirmDelete(true);
    }
    setInfo(null);
  };

  const handleEdit = (note: INote) => {
    setEditingNote(note);
  };

  const handleShare = (note: INote) => {
    const noteLink =
      note.visibility === "hidden" && note.secret_key
        ? `${note.id}?key=${note.secret_key}`
        : `${note.id}`;
    navigator.clipboard.writeText(`http://localhost:5173/note/${noteLink}`);
    setInfo({
      type: "ok",
      title: "Link Copied",
      description: "Note link copied to clipboard.",
      link: `http://localhost:5173/note/${noteLink}`,
    });
  };

  const handleDelete = (note: INote) => {
    setConfirmDelete(note);
    setInfo({
      type: "error",
      title: `Delete Note: ${note.title}`,
      description: "Are you sure you want to delete this note?",
      choice: true,
    });
  };

  const handleConfirmDelete = async (choice: boolean) => {
    if (!choice || !confirmDelete) {
      setConfirmDelete(null);
      setInfo(null);
      return;
    }

    try {
      await deleteNote(confirmDelete.id);

      setNotes((prevNotes) =>
        prevNotes ? prevNotes.filter((n) => n.id !== confirmDelete.id) : null
      );
      setInfo({
        type: "ok",
        title: "Note Deleted",
        description: "The note has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      setInfo({
        type: "error",
        title: "Deletion Failed",
        description: "An error occurred while deleting the note.",
      });
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleUpdateNote = async (
    formData: { [key: string]: any },
    selectedFiles: File[],
    existingFiles: any[]
  ) => {
    try {
      if (!editingNote || !editingNote.id) {
        console.error("Error: Note ID is undefined");
        return;
      }

      const updatedNote = { ...editingNote, ...formData };

      if (updatedNote.visibility === "public") {
        updatedNote.secret_key = null;
      }

      let uploadedFiles = [];
      if (selectedFiles.length > 0) {
        const formDataToSend = new FormData();
        formDataToSend.append("note_id", updatedNote.id.toString());
        selectedFiles.forEach((file) => {
          formDataToSend.append("file[]", file);
        });

        const uploadResponse = await uploadFile(formDataToSend);
        uploadedFiles = uploadResponse.file_paths;
      }

      updatedNote.files = [...(existingFiles || []), ...uploadedFiles];

      await updateNote(updatedNote.id, updatedNote);

      setNotes((prevNotes) =>
        prevNotes
          ? prevNotes.map((note) =>
              note.id === updatedNote.id ? updatedNote : note
            )
          : null
      );

      setEditingNote(null);
      setInfo({
        type: "ok",
        title: "Note Updated",
        description: "The note has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const groupNotesBySubject = (notes: INote[]) => {
    return notes.reduce((groups, note) => {
      const subjectId = note.subject_id || "Unassigned";
      if (!groups[subjectId]) {
        groups[subjectId] = [];
      }
      groups[subjectId].push(note);
      return groups;
    }, {} as { [key: string]: INote[] });
  };

  if (!user && !info) {
    navigate("/login");
  }

  if (loadingNotes) {
    return <p className="text-muted">Loading notes...</p>;
  }

  const groupedNotes = notes ? groupNotesBySubject(notes) : {};

  return (
    <div className="container mt-5">
      {info && (
        <InfoCard
          type={info.type}
          title={info.title}
          description={info.description}
          link={info.link}
          choice={info.choice}
          onClose={handleCloseInfoCard}
        />
      )}
      {user && (
        <div>
          <div className="row mb-4">
            <div className="col text-center">
              <h1 className="display-3">Dashboard</h1>
              <div className="d-flex justify-content-center align-items-center">
                <h4 className="text-muted mb-0 me-3">Hello, {user.username}</h4>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {Object.keys(groupedNotes).length > 0 ? (
            <div>
              {Object.entries(groupedNotes).map(([subjectId, notes]) => (
                <div key={subjectId} className="mb-4">
                  <h5 className="">
                    {subjects.find((s) => s.id === Number(subjectId))?.name ||
                      "Unassigned"}
                  </h5>
                  <div className="row g-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="col-sm-12 col-lg-6 col-xl-4"
                      >
                        <NoteCardSmall
                          note={note}
                          onEdit={handleEdit}
                          onShare={handleShare}
                          onDelete={handleDelete}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">
              No notes available. Start creating some!
            </p>
          )}
        </div>
      )}

      {editingNote && (
        <EditNoteModal
          show={!!editingNote}
          handleClose={() => setEditingNote(null)}
          note={editingNote}
          onUpdate={handleUpdateNote}
        />
      )}
    </div>
  );
};

export default Dashboard;
