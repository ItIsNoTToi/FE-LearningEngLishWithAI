import axios from "axios";
import { URL_API } from "@env";

const axiosInstance = axios.create({
  baseURL: URL_API, 
  timeout: 10000, // Set a timeout of 10 seconds
});

export default axiosInstance;
