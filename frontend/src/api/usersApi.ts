import axios from "axios";

const BASE_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

export const getProfilePic = async () => {
  if (!token) {
    console.error("No token found");
    throw new Error("Token not found");
  }

  try {
    const response = await axios.get(`${BASE_URL}/serveProfilePic.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    if (response.status === 200) {
      const imageUrl = URL.createObjectURL(response.data);

      return imageUrl;
    } else {
      throw new Error("Failed to fetch profile picture");
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw error;
  }
};
