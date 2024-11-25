import axios from "axios";
import { IUser } from "../models/IUser";

const BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

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

export const isLoggedIn = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/authMiddleware.php`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data.success) {
            console.log(response.data)
        }

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

