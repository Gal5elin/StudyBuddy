import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { INote } from "../../models/INote";
import {
  downloadAllFiles,
  getHiddenNote,
  getNoteById,
} from "../../api/notesApi";
import PDFViewer from "../common/PDFViewer";
import { Tabs, Tab, Button, Alert } from "react-bootstrap";

const NoteDetails = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [searchParams] = useSearchParams();
  const [note, setNote] = useState<INote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        setError(null);
        setNote(null);

        if (noteId) {
          let data;
          const key = searchParams.get("key");

          if (key) {
            data = await getHiddenNote(noteId, key);
          } else {
            data = await getNoteById(noteId);
          }

          if (data && "error" in data) {
            setError(data.error as string);
          } else {
            setNote(data as INote);
          }
        } else {
          setError("Note ID is undefined.");
        }
      } catch (error: any) {
        setError("An unexpected error occurred.");
        console.error("Error fetching note details:", error);
      }
    };

    fetchNoteDetails();
  }, [noteId, searchParams]);

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center">
          <h4>Error</h4>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleDownloadAll = () => {
    downloadAllFiles(note.id);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{note.title}</h2>
        </div>
        <div className="card-body">
          <p className="lead">{note.description}</p>

          <Button
            variant="success"
            onClick={handleDownloadAll}
            className="me-3"
          >
            Download All
          </Button>

          {note.files && note.files.length > 0 ? (
            <Tabs defaultActiveKey={note.files[0].id} id="file-tabs">
              {note.files.map((file) => (
                <Tab
                  key={file.id}
                  eventKey={file.id}
                  title={file.file_name || `File ${file.id}`}
                >
                  <div className="mt-4">
                    <PDFViewer noteId={note.id} fileId={file.id} />
                  </div>
                </Tab>
              ))}
            </Tabs>
          ) : (
            <div className="alert alert-warning mt-4" role="alert">
              No files associated with this note.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
