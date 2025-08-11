import axiosInstance from "../../config/axiosconfig";

export const fetchChatlog = async (userId: any, lessonId: any) => {
    try {

        // console.log(userId, lessonId);
        const response = await axiosInstance.post('/api/getchatlog',
        {
            userId: userId, 
            lessonId: lessonId
        })

        return response.data;
    } catch (error) {
        console.error(error);
    }
}