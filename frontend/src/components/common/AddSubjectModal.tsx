import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ISubject } from "../../models/ISubject";

interface AddSubjectModalProps {
  show: boolean;
  handleClose: () => void;
  onSubmit: (formData: ISubject) => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  show,
  handleClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Subject Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Subject
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

export default AddSubjectModal;
