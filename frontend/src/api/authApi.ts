import axios from "axios";
import { IUser } from "../models/IUser";

const BASE_URL = "http://localhost:8080";

export const register = async (formData: FormData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register.php`, formData);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const login = async (user: IUser): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/login.php`, user);
        
        if (response.data.success) {
            localStorage.setItem("token", response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const isLoggedIn = () => {
    return localStorage.getItem("token") !== null;
};

