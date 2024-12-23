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

export const getNoteById = async (noteId: string): Promise<INote> => {
  try {
    const response = await axios.get<INote>(
      `${BASE_URL}/getNoteById.php?noteId=${noteId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching note:", error.message || error);
    throw new Error("Unable to fetch the note. Please try again later.");
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

export const uploadFile = async (file: File, noteId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  if (!noteId) {
    throw new Error("Note ID is required to associate the file with the note.");
  }

  const formData = new FormData();
  formData.append("file", file); // Append the file
  formData.append("note_id", noteId.toString()); // Append the note_id to associate with the file

  try {
    const response = await axios.post(`${BASE_URL}/uploadFile.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authorization
        "Content-Type": "multipart/form-data", // Required for file upload
      },
    });

    return response.data; // Return the response data (success message or file metadata)
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred while uploading the file.");
    }
  }
};

export const downloadFile = async (noteId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  if (!noteId) {
    throw new Error("Note ID is required to fetch the file.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId },
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authorization
      },
      responseType: "blob", // Set the response type to blob for file download
    });

    // Create a link to download the file
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = noteId.toString(); // You can specify the filename here if available
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred while downloading the file.");
    }
  }
};

export const serveFile = async (noteId: number, fileId: number): Promise<string> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId, file_id: fileId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Important for binary data
    });

    // Create a Blob URL for the PDF
    return URL.createObjectURL(response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An unknown error occurred while fetching the PDF."
    );
  }
};

export const getNoteFiles = async (noteId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/getNoteFiles.php`, {
      params: { note_id: noteId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An unknown error occurred while fetching the note files."
    );
  }
};


export const downloadAllFiles = async (noteId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId, download_all: true },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Handle file as blob
    });

    // Extract filename from Content-Disposition or use default
    //const contentDisposition = response.headers["content-disposition"];
    const filename = "files.zip";

    // Create a blob and trigger download
    const blob = new Blob([response.data], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href); // Clean up URL
  } catch (error: any) {
    console.error("Error downloading files:", error);
    throw new Error("Failed to download files.");
  }
};

