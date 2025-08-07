import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.4:3000", // Default to localhost if URL_API is not set
  timeout: 10000, // Set a timeout of 10 seconds
});

export default axiosInstance;
