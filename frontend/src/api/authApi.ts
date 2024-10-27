import axios from "axios";
import { IUser } from "../models/IUser";

const BASE_URL = "http://localhost:8080";

export const register = async (user: IUser): Promise<IUser[]> => {
    try {
        const response = await axios.post<IUser[]>(`${BASE_URL}/register.php`, user);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};
