import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ISubject } from "../../models/ISubject";

interface AddNoteModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (formData: { [key: string]: any }, files: File[]) => void;
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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedFiles);

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Note</Modal.Title>
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

          <Form.Group controlId="fileUpload" className="mb-3">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control
              type="file"
              name="files"
              onChange={handleFileChange}
              multiple
              accept="image/*,application/pdf"
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
