import axiosInstance from "../../config/axiosconfig";
import { URL_API } from "@env";
import EventSource from "react-native-sse";

export const fetchAIStream = (data: any, onDelta: (delta: string) => void, onDone: () => void) => {
  const es = new EventSource(`${URL_API}/api/ai/lesson-chat-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  es.addEventListener("message", (event) => {
    if (event.data === "[DONE]") {
      onDone();
      es.close();
    } else {
      if (event.data !== null) {
        // console.log("Received SSE data:", event.data);
        onDelta(event.data);
      }
    }
  });

  es.addEventListener("error", (event) => {
    console.error("SSE error:", event);
    es.close();
  });
};


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