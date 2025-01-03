import axios from "axios";
import { ISubject } from "../models/ISubject";

const BASE_URL = "http://localhost:8080";

export const getSubjects = async (): Promise<ISubject[]> => {
  try {
    const response = await axios.get<ISubject[]>(`${BASE_URL}/getSubjects.php`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

export const getSubjectById = async (subjectId: string): Promise<ISubject> => {
  try {
    const response = await axios.get<ISubject>(
      `${BASE_URL}/getSubjectById.php?subjectId=${subjectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subject:", error);
    throw error;
  }
};

export const addSubject = async (subject: ISubject): Promise<ISubject> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("is missing");
    }

    const response = await axios.post<ISubject>(
      `${BASE_URL}/addSubject.php`, subject,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};
