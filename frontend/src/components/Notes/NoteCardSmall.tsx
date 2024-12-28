import { INote } from "../../models/INote";
import { Link } from "react-router-dom";
import { BsPencil, BsSend, BsTrash3 } from "react-icons/bs";

const NoteCardSmall = ({
  note,
  onEdit,
  onShare,
  onDelete,
}: {
  note: INote;
  onEdit: (note: INote) => void;
  onShare: (note: INote) => void;
  onDelete: (note: INote) => void;
}) => {
  const noteLink =
    note.visibility === "hidden" && note.secret_key
      ? `${note.id}?key=${note.secret_key}`
      : `${note.id}`;

  return (
    <div className="card m-1 position-relative" style={{ width: "25rem" }}>
      <div className="d-flex align-items-center justify-content-between p-2">
        <Link
          to={noteLink}
          className="text-decoration-none"
          style={{ color: "black", flex: 1 }}
        >
          <h5 className="card-title fs-6 mb-0 text-truncate">{note.title}</h5>
        </Link>
        <div className="d-flex align-items-center">
          <BsSend
            className="me-2"
            style={{
              cursor: "pointer",
              fontSize: "1.35rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              onShare(note);
            }}
          />
          <BsPencil
            className="me-2"
            style={{
              cursor: "pointer",
              fontSize: "1.35rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              onEdit(note);
            }}
          />
          <BsTrash3
            style={{
              cursor: "pointer",
              fontSize: "1.35rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              onDelete(note);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCardSmall;
