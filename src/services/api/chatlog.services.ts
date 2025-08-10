import axiosInstance from "../../config/axiosconfig";

export const fetchChatlog = async (userId: any, lessionId: any) => {
    try {
        const response = await axiosInstance.post('/api/getchatlog',
        {
            userId,
            lessionId
        })

        return response.data;
    } catch (error) {
        console.error(error);
    }

}