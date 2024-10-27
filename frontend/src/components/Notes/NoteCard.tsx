import { INote } from "../../models/INote";
import "./Notes.css";

const NoteCard = ({note}: {note:INote}) => {
    return (
        <>
            <div className="noteCard card m-3">
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <div className="card-text">{note.description}</div>
                </div>
            </div>
        </>
    );
}

export default NoteCard;