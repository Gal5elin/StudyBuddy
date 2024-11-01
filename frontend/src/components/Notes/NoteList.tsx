import { useEffect, useState } from "react";
import { INote } from "../../models/INote";
import { getNotesBySubject } from "../../api/notesApi";
import NoteCard from "./NoteCard";
import { useParams } from "react-router-dom";

const NoteList = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (subjectId) {
        try {
          const allNotes = await getNotesBySubject(subjectId);
          setNotes(allNotes);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      } else {
        console.error("Subject ID is undefined");
      }
    };

    fetchNotes();
  }, [subjectId]);

  return (
    <>
      <div className="d-flex justify-content-center">
        {notes.map((note, index) => (
          <div className="flex-fill" key={index}>
            <NoteCard note={note} />
          </div>
        ))}
      </div>
    </>
  );
};

export default NoteList;
