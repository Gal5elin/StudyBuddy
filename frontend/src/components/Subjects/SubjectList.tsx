import { useEffect, useState } from "react";
import { ISubject } from "../../models/ISubject";
import { getSubjects } from "../../api/subjectsApi";
import SubjectCard from "./SubjectCard";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const allSubjects = await getSubjects();
        setSubjects(allSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleSelect = (subject: ISubject) => {
    document.location.href = `/subject/${subject.id}/notes`;
  };
  

  return (
    <>
      <h1 className="text-center my-4">Subjects</h1>
      <div className="d-flex justify-content-center">
        {subjects.map((subject, index) => (
          <div className="flex-fill" key={index}>
            <SubjectCard subject={subject} onSelect={handleSelect} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SubjectList;