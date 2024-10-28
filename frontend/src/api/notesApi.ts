import axios from "axios";
import { INote } from "../models/INote";

const BASE_URL = 'http://localhost:8080'

export const getNotes = async (): Promise<INote[]> => {
    try {
        const response = await axios.get<INote[]>(`${BASE_URL}/getNotes.php`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};

export const getNotesBySubject = async (subjectId: string): Promise<INote[]> => {
    try {
        const response = await axios.get<INote[]>(`${BASE_URL}/getNotesBySubject.php?subjectId=${subjectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notes:', error);
        throw error;
    }
};