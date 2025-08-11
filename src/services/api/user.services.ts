import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../config/axiosconfig";

export const getProfile = async () => {
  try {
    // Lấy token đã lưu sau khi login
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }
    // console.log(token);

    const res = await axios.get("/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token lên BE
      },
    });
    // console.log(res.data);

    return res.data; // Dữ liệu user trả về từ BE
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};
