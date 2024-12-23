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
      responseType: "blob", // Expecting a binary response (image)
    });

    // Here, response.data is a blob (the image file)
    if (response.status === 200) {
      // Create an object URL for the image blob
      const imageUrl = URL.createObjectURL(response.data);

      return imageUrl; // Return the image URL to use in your component
    } else {
      throw new Error("Failed to fetch profile picture");
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw error;
  }
};
