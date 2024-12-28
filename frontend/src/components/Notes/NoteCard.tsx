import { INote } from "../../models/INote";
import { Link } from "react-router-dom";
import "./Notes.css";

const NoteCard = ({ note }: { note: INote }) => {
  return (
    <Link to={`${note.id}`} className="text-decoration-none">
      <div
        className="note-card card h-100 shadow-sm"
        style={{ minWidth: "350px" }}
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate mb-1">{note.title}</h5>
          <p className="card-text text-truncate">{note.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
