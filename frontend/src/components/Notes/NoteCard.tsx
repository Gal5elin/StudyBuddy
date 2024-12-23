import { INote } from "../../models/INote";
import { Link } from "react-router-dom";
import "./Notes.css";

const NoteCard = ({ note }: { note: INote }) => {
    return (
        <>
            <Link to={`${note.id}`} className="text-decoration-none">
                <div className="noteCard card m-3">
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <div className="card-text">{note.description}</div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default NoteCard;
