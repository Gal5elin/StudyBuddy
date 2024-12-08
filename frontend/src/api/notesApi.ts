import axios from "axios";
import { INote } from "../models/INote";

const BASE_URL = "http://localhost:8080";

export const getNotes = async (): Promise<INote[]> => {
  try {
    const response = await axios.get<INote[]>(`${BASE_URL}/getNotes.php`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const getNotesBySubject = async (
  subjectId: string
): Promise<INote[]> => {
  try {
    const response = await axios.get<INote[]>(
      `${BASE_URL}/getNotesBySubject.php?subjectId=${subjectId}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

export const addNote = async (formData: { [key: string]: any }) => {
  const token = localStorage.getItem("token");

  // Ensure token exists before proceeding
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    // Send the form data as JSON in the body of the request
    const response = await axios.post(`${BASE_URL}/addNote.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure the backend knows we're sending JSON
      },
    });

    return response.data;
  } catch (error: any) {
    // Handle backend-specific errors if available
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      // Throw a generic error if no specific error message is returned
      throw new Error("An unknown error occurred while adding the note.");
    }
  }
};
