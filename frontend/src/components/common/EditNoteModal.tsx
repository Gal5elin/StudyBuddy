import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ISubject } from "../../models/ISubject";
import { getSubjects } from "../../api/subjectsApi";
import { INoteFile } from "../../models/INote";

interface EditNoteModalProps {
  show: boolean;
  handleClose: () => void;
  note: { [key: string]: any };
  onUpdate: (
    formData: { [key: string]: any },
    selectedFiles: File[],
    existingFiles: File[]
  ) => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  show,
  handleClose,
  note,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    title: note.title || "",
    description: note.description || "",
    subject: note.subject || "",
    visibility: note.visibility || "public",
    secret_key: note.secret_key || "",
  });

  const [existingFiles, setExistingFiles] = useState(note.files || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      fetchSubjects();
    }
  }, [show]);

  useEffect(() => {
    if (note) {
      setFormData((prev) => ({
        ...prev,
        title: note.title || "",
        description: note.description || "",
        subject: note.subject || "",
        visibility: note.visibility || "public",
        secret_key: note.secret_key || "",
      }));

      setExistingFiles(note.files || []);
    }
  }, [note]);

  useEffect(() => {
    if (subjects.length > 0) {
      const matchingSubject = subjects.find(
        (subject) => subject.id === note.subject_id
      );
      if (matchingSubject) {
        setFormData((prev) => ({
          ...prev,
          subject: matchingSubject.id,
        }));
      }
    }
  }, [subjects, note]);

  useEffect(() => {}, [subjects, note]);

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    setError(null);
    try {
      const fetchedSubjects = await getSubjects();
      setSubjects(fetchedSubjects);
    } catch (err) {
      setError("Failed to fetch subjects.");
      console.error("Error fetching subjects:", err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  const handleRemoveExistingFile = (fileId: number) => {
    setExistingFiles((prev: INoteFile[]) =>
      prev.filter((file) => file.file_id !== fileId)
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdate(formData, selectedFiles, existingFiles);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Note Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Note Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="subject" className="mb-3">
            <Form.Label>Subject</Form.Label>
            {loadingSubjects ? (
              <p>Loading subjects...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <Form.Control
                as="select"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            )}
          </Form.Group>

          <Form.Group controlId="visibility" className="mb-3">
            <Form.Label>Visibility</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Public"
                name="visibility"
                value="public"
                checked={formData.visibility === "public"}
                onChange={handleChange}
                required
              />
              <Form.Check
                type="radio"
                label="Hidden"
                name="visibility"
                value="hidden"
                checked={formData.visibility === "hidden"}
                onChange={handleChange}
                required
              />
            </div>
          </Form.Group>

          {formData.visibility === "hidden" && (
            <Form.Group controlId="secret_key" className="mb-3">
              <Form.Label>Secret Key</Form.Label>
              <Form.Control
                type="text"
                name="secret_key"
                value={formData.secret_key}
                onChange={handleChange}
                placeholder="Enter a secret key"
                required
              />
            </Form.Group>
          )}

          <Form.Group controlId="existingFiles" className="mb-3">
            <Form.Label>Existing Files</Form.Label>
            <ul>
              {existingFiles.map((file: INoteFile) => (
                <li key={file.file_id}>
                  <a
                    href={file.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.file_name}
                  </a>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveExistingFile(file.file_id!)}
                    className="m-1"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Group>

          <Form.Group controlId="fileUpload" className="mb-3">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control
              type="file"
              name="files"
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf,application/msword"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditNoteModal;
