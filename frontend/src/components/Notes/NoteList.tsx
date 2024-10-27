import { useEffect, useState } from "react";
import { INote } from "../../models/INote";
import { getNotes } from "../../api/notesApi";
import NoteCard from "./NoteCard";

const NoteList = () => {
  const [notes, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const allNotes = await getNotes();
        setNotes(allNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

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