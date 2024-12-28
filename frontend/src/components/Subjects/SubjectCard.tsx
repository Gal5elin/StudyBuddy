import { ISubject } from "../../models/ISubject";
import "./Subject.css";

const SubjectCard = ({
  subject,
  onSelect,
}: {
  subject: ISubject;
  onSelect: (subject: ISubject) => void;
}) => {
  const handleSelect = () => {
    onSelect(subject);
  };

  return (
    <>
      <a
        href="#"
        className="card subject-card align-items-center m-3 text-decoration-none"
        key={subject.id}
        onClick={() => handleSelect()}
      >
        <div className="card-body">
          <h5 className="card-title m-0">{subject.name}</h5>
        </div>
      </a>
    </>
  );
};

export default SubjectCard;
