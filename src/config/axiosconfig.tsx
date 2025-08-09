import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.4:3000", 
  // baseURL: "http://10.3.17.130:3000",
  timeout: 10000, // Set a timeout of 10 seconds
});

export default axiosInstance;
