import axiosInstance from "../../config/axiosconfig";

export const GetQuiz = async () => {
    try {
        const response = await axiosInstance.get('/api/quizs');
        if(response.data.success == true){
            return response.data;
        }
    } catch (error) {
        return error;
    }
}