import { useEffect, useState } from "react";
import { ISubject } from "../../models/ISubject";
import { getSubjects } from "../../api/subjectsApi";
import SubjectCard from "./SubjectCard";
import { Alert, Button } from "react-bootstrap";
import AddNoteModal from "../common/AddNoteModal";
import { addNote, uploadFile } from "../../api/notesApi";
import { useNavigate } from "react-router-dom";
import InfoCard from "../common/InfoCard";
import { useUser } from "../Auth/UserContext";

const SubjectList = () => {
  const { user } = useUser();
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [info, setInfo] = useState<{
    type: "ok" | "error" | "warning";
    title: string;
    description: string;
    link?: string;
    choice?: boolean;
    onClose?: (choice: boolean) => void;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const allSubjects = await getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSelect = (subject: ISubject) => {
    document.location.href = `/subject/${subject.id}/notes`;
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormSubmit = async (
    formData: { [key: string]: any },
    files: File[]
  ) => {
    if (!formData.title || !formData.subject || !formData.visibility) {
      setError("Title, subject, and visibility are required fields.");
      return;
    }

    try {
      const noteResponse = await addNote(formData);
      const noteId = noteResponse.data.noteId;
      const visibility = formData.visibility;

      console.log(formData);

      if (visibility === "hidden") {
        setNoteId(`${noteId}?key=${formData.secret_key}`);
      } else {
        setNoteId(noteId);
      }

      if (files.length > 0) {
        const formDataToSend = new FormData();
        formDataToSend.append("note_id", noteId);
        files.forEach((file) => {
          formDataToSend.append("file[]", file);
        });

        await uploadFile(formDataToSend);
      }

      setShowModal(false);
      setError(null);
      setInfo({
        type: "ok",
        title: "Note Added",
        description: "Your note has been added successfully",
      });
    } catch (error: any) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again.");
    }
  };

  const handleCloseInfoCard = () => {
    setInfo(null);
    navigate(`/note/${noteId}`);
  };

  return (
    <>
      <h1 className="text-center my-4">Subjects</h1>
      {user && (
        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" onClick={handleShowModal}>
            Add New Note
          </Button>
        </div>
      )}
      {showModal && (
        <AddNoteModal
          show={showModal}
          handleClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          subjects={subjects}
        />
      )}

      {info && (
        <InfoCard
          type={info.type}
          title={info.title}
          description={info.description}
          onClose={handleCloseInfoCard}
        />
      )}

      {error && (
        <div className="d-flex justify-content-center mt-3">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}

      <div className="d-flex justify-content-center">
        {subjects.map((subject, index) => (
          <div className="flex-fill" key={index}>
            <SubjectCard subject={subject} onSelect={handleSelect} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SubjectList;
