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

  return (
    <>
      <div className="d-flex justify-content-center">
        {subjects.map((subject, index) => (
          <div className="flex-fill" key={index}>
            <SubjectCard subject={subject} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SubjectList;