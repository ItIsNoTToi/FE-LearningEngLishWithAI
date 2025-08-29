import axios from "axios";
import { URL_API } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: URL_API, 
  timeout: 10000, // Set a timeout of 10 seconds
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
