import axios from "axios";

const BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

export const getProfilePic = async () => {
  console.log(token);
  try {
    const response = await axios.get(`${BASE_URL}/serveProfilePic.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    if (response.data.success) {
      console.log(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
