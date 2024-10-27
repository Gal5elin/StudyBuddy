import axios from "axios";
import { IUser } from "../models/IUser";

const BASE_URL = "http://localhost:8080";

export const register = async (user: IUser): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/register.php`, user);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const login = async (user: IUser): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/login.php`, user);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};