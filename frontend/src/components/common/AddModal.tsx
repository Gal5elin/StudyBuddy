import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ISubject } from "../../models/ISubject"; // Ensure the correct path
import { getSubjectById, getSubjects } from "../../api/subjectsApi";
import { useParams } from "react-router-dom";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio";
  required?: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

interface FormConfig {
  title: string;
  submitButtonText: string;
  fields: Field[];
}

interface AddModalProps {
  show: boolean;
  handleClose: () => void;
  formConfig: FormConfig;
  onSubmit: (formData: { [key: string]: any }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ show, handleClose, formConfig, onSubmit }) => {
  // Dynamically set the initial form data based on the field types
  const [formData, setFormData] = useState<{ [key: string]: any }>(
    formConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {} as { [key: string]: any })
  );

  const [subjects, setSubjects] = useState<ISubject[]>([]); // State for subjects
  const [loading, setLoading] = useState<boolean>(false); // Loading state for subjects
  const [error, setError] = useState<string | null>(null); // Error state for subjects

  const { id: subjectId } = useParams<{ id: string }>(); // Destructure subject ID from URL params

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      try {
        if (subjectId) {
          console.log("Fetching subject with ID:", subjectId);
          const fetchedSubject = await getSubjectById(subjectId);
          setSubjects([fetchedSubject]);
        } else {
          setError("No subject ID provided");
        }
      } catch (err) {
        setError("Error fetching subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]); // The effect depends on the subjectId

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // If the input type is radio, we need to handle it differently
    if (e.target.type === "radio") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Pass data back to the parent component
    handleClose(); // Close the modal
  };

  // Handle the loading or error state for the select dropdown
  if (loading) {
    return <div>Loading subjects...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{formConfig.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {formConfig.fields.map((field) => (
            <Form.Group key={field.name} controlId={field.name} className="mb-3">
              <Form.Label>{field.label}</Form.Label>

              {field.type === "textarea" ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <Form.Control
                  as="select"
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Form.Control>
              ) : field.type === "radio" ? (
                <div>
                  {field.options?.map((option) => (
                    <Form.Check
                      key={option}
                      type="radio"
                      label={option}
                      name={field.name} // Grouped by name
                      value={option}
                      checked={formData[field.name] === option}
                      onChange={handleChange}
                      required={field.required}
                    />
                  ))}
                </div>
              ) : (
                <Form.Control
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              )}
            </Form.Group>
          ))}
          <Button variant="primary" type="submit">
            {formConfig.submitButtonText}
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

export default AddModal;
