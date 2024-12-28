import { useEffect, useState } from "react";
import { INote } from "../../models/INote";
import { getNotesBySubject } from "../../api/notesApi";
import NoteCard from "./NoteCard";
import { useParams } from "react-router-dom";
import { Alert, Spinner, Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { getSubjectById } from "../../api/subjectsApi";

const NoteList = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<INote[]>([]);
  const [subject, setSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchNotes = async () => {
    if (subjectId) {
      setLoading(true);
      try {
        const allNotes = await getNotesBySubject(subjectId);
        setNotes(allNotes);
        setError(null);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to load notes. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Subject ID is undefined");
      setLoading(false);
    }
  };

  const fetchSubject = async () => {
    if (subjectId) {
      try {
        const subject = await getSubjectById(subjectId);
        setSubject(subject.name);
      } catch (error) {
        console.error("Error fetching subject:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchSubject();
  }, []);

  const groupNotesByDay = (notes: INote[]) => {
    return notes.reduce((groups, note) => {
      const date = note.created_at.split(" ")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].unshift(note);
      return groups;
    }, {} as { [date: string]: INote[] });
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedNotes = groupNotesByDay(filteredNotes);

  const sortedGroupedNotes = Object.fromEntries(
    Object.entries(groupedNotes).sort(([a], [b]) => b.localeCompare(a))
  );

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <div className="d-flex justify-content-center mt-3">
          <Alert variant="danger">{error}</Alert>
        </div>
      ) : (
        <div className="container mt-4">
          <h1 className="h1 text-center mb-4">{subject}</h1>
          <Form.Group className="mb-4 w-25 mx-auto">
            <InputGroup>
              <InputGroup.Text>
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {filteredNotes.length === 0 ? (
            <Alert variant="info" className="text-center">
              No notes found.
            </Alert>
          ) : (
            Object.entries(sortedGroupedNotes).map(([date, notesForDate]) => (
              <div key={date} className="mb-4">
                <h5 className="h5 text-muted">{date}</h5>
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {notesForDate.map((note) => (
                    <div className="col" key={note.id}>
                      <div
                        className="card h-100 border-0">
                        <NoteCard note={note} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default NoteList;
