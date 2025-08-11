import axiosInstance from "../../config/axiosconfig";

export const fetchProgressApi = async (userId: any) =>{
    try {
        const response = await axiosInstance.get(`/api/progress/${userId}`);
        return response.data;
    } catch (error) {
        throw Error;    
    }
} 