import axios from "../../config/axiosconfig";
import { URL_API } from "@env";

// Play audio từ URL backend trả về
export const playLessonAudio = async (
  userId: string,
  lessonId: string,
  onFinish: (question: string) => void
) => {
  try {
    // 1. Gọi backend để generate audio
    const res = await axios.get(`/api/listen/${lessonId}/AIGenerateAudio`);
    const data = res.data;

    if (data.audioUrl) {
      const fullUrl = `${URL_API}${data.audioUrl}`;

      // Phát audio bằng Expo AV
      const { Audio } = await import("expo-av");
      const { sound } = await Audio.Sound.createAsync({ uri: fullUrl });

      await sound.playAsync();

      // Đợi phát xong thì gọi API hỏi câu hỏi
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          const qRes = await axios.post(`/api/listen/${lessonId}/ask`, {});
          onFinish(qRes.data.question);
        }
      });
    }
  } catch (err) {
    console.error("Error playing lesson audio:", err);
  }
};

// Gửi câu trả lời học viên để AI chấm điểm
export const sendAnswer = async (
  lessonId: string,
  userAnswer: string,
  onResult: (feedback: string) => void
) => {
  try {
    const res = await axios.post(`/api/listen/${lessonId}/ask`, { userAnswer });
    onResult(res.data.feedback);
  } catch (err) {
    console.error("Error sending answer:", err);
  }
};
