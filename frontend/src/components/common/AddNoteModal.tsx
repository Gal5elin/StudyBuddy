import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ISubject } from "../../models/ISubject"; // Ensure the correct path

interface AddNoteModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (formData: { [key: string]: any }, files: File[]) => void; // Accept multiple files
  subjects: ISubject[];
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
  show,
  handleClose,
  onSubmit,
  subjects,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    visibility: "public",
    secret_key: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Store multiple files

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files); // Store all selected files
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedFiles); // Pass form data and all selected files to parent
    handleClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Title Field */}
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

          {/* Description Field */}
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

          {/* Subject Field */}
          <Form.Group controlId="subject" className="mb-3">
            <Form.Label>Subject</Form.Label>
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
          </Form.Group>

          {/* Visibility Field */}
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

          {/* Secret Key Field (only visible when visibility is 'hidden') */}
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

          {/* Multiple File Upload Field */}
          <Form.Group controlId="fileUpload" className="mb-3">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control
              type="file"
              name="files"
              onChange={handleFileChange}
              multiple // Allow multiple file selection
              accept="image/*,application/pdf,application/msword"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Note
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

export default AddNoteModal;
