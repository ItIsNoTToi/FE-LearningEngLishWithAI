import axiosInstance from "../../config/axiosconfig";

export const fetchAI = async (data: any): Promise<any> => {
    try {
        const response = await axiosInstance.post('/api/ai/lesson-chat',{
            sessionId: data.sessionId, 
            userId: data.userId, 
            lessonId: data.lessonId, 
            userSpeechText: data.userSpeechText ,
        });

        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}

export const startLessonAI = async (userId: any, lessonId: any) => {
    try {
        const response = await axiosInstance.post('/api/ai/start',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        console.log('loi ne', error.message);
        throw Error ( error.message);
    }
}

export const EndLessonAI = async (userId: any, lessonId: any) => {
    try {
        const response = await axiosInstance.post('/api/ai/finish',{
            userId: userId, 
            lessonId: lessonId 
        })   
        return response.data;
    } catch (error: any) {
        throw Error (error.message);
    }
}