import { ISubject } from "../../models/ISubject";

const SubjectCard = ({ subject }: {subject:ISubject}) => {
  return (
    <>
      <div className="card align-items-center m-3" key={subject.id}>
        <div className="card-body">
          <h5 className="card-title m-0">{subject.name}</h5>
        </div>
      </div>
    </>
  );
};

export default SubjectCard;