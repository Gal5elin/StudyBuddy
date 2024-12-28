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

export const getNoteByUser = async (): Promise<INote[]> => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get<INote[]>(
      `${BASE_URL}/getNotesByUser.php`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching note:", error.message || error);
    throw new Error("Unable to fetch the note. Please try again later.");
  }
};

export const getHiddenNote = async (noteId: string, secretKey: string) => {
  try {
    const response = await axios.get<INote>(
      `${BASE_URL}/getNoteById.php?noteId=${noteId}&key=${secretKey}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching note:", error.message || error);
    throw new Error("Unable to fetch the note. Please try again later.");
  }
};

export const addNote = async (formData: { [key: string]: any }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("is missing");
  }

  try {
    const response = await axios.post(`${BASE_URL}/addNote.php`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred while adding the note.");
    }
  }
};

export const updateNote = async (
  noteId: number,
  formData: { [key: string]: any }
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("is missing");
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/updateNote.php`,
      {
        id: noteId,
        ...formData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred while updating the note.");
    }
  }
};

export const uploadFile = async (form: FormData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.post(`${BASE_URL}/uploadFile.php`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("An unknown error occurred while uploading the file.");
    }
  }
};

export const downloadFile = async (noteId: number) => {
  if (!noteId) {
    throw new Error("Note ID is required to fetch the file.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId },
      responseType: "blob",
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = noteId.toString();
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

export const serveFile = async (
  noteId: number,
  fileId: number
): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId, file_id: fileId },
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An unknown error occurred while fetching the PDF."
    );
  }
};

export const downloadAllFiles = async (noteId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/serveFile.php`, {
      params: { note_id: noteId, download_all: true },
      responseType: "blob",
    });

    const filename = "files.zip";

    const blob = new Blob([response.data], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error: any) {
    console.error("Error downloading files:", error);
    throw new Error("Failed to download files.");
  }
};

export const deleteNote = async (noteId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token is missing.");
  }

  try {
    const response = await axios.delete(`${BASE_URL}/deleteNote.php`, {
      params: { note_id: noteId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error ||
        "An unknown error occurred while deleting the note."
    );
  }
};
