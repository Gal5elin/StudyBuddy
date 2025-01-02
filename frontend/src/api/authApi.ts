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

export const getUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`${BASE_URL}/getUser.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return response.data.user;
    } else {
      console.error("Error in response data:", response.data);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const isLoggedIn = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${BASE_URL}/getUser.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const sendMail = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/sendMail.php`, { email });
    console.log("Mail sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
}