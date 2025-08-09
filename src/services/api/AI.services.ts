import axiosInstance from "../../config/axiosconfig";

export const fetchAI = async (data: any): Promise<any> => {
    try {
        const response = await axiosInstance.post('/api/ai/lession-chat',{
            sessionId: data.sessionId, 
            userId: data.userId, 
            lessionId: data.lessionId, 
            userSpeechText: data.userSpeechText ,
        });

        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}