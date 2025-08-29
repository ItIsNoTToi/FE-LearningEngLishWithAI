// hooks/useChatlog.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchChatlog } from "../services/api/chatlog.services";

type ChatMessage = { from: "user" | "ai"; text: string };

const storageKey = (userId: string, lessonId: string) =>
  `chatlog:${userId}:${lessonId}`;

export function useChatlog(userId?: string, lessonId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<ChatMessage[]>({
    queryKey: ["chatlog", userId, lessonId],
    queryFn: async () => {
      if (!userId || !lessonId) return [];

      const key = storageKey(userId, lessonId);

      // 1. Thử lấy từ AsyncStorage
      const cached = await AsyncStorage.getItem(key);
      if (cached) return JSON.parse(cached);

      // 2. Nếu không có, gọi API
      const res = await fetchChatlog(userId, lessonId);
      const messages = res?.data?.messages ?? [];

      // 3. Lưu lại cache
      await AsyncStorage.setItem(key, JSON.stringify(messages));

      return messages;
    },
    enabled: !!userId && !!lessonId, // chỉ chạy khi có đủ params
    staleTime: 1000 * 60, // giữ 1 phút
  });

  const appendMessage = (msg: ChatMessage) => {
    queryClient.setQueryData<ChatMessage[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        const newMsgs = [...old, msg];
        if (userId && lessonId) {
          AsyncStorage.setItem(
            storageKey(userId, lessonId),
            JSON.stringify(newMsgs)
          );
        }
        return newMsgs;
      }
    );
  };

  const patchLastAIMessage = (delta: string) => {
    queryClient.setQueryData<ChatMessage[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        if (!old.length) return old;
        const newMsgs = [...old];
        const last = newMsgs[newMsgs.length - 1];
        newMsgs[newMsgs.length - 1] = {
          ...last,
          text: last.text + delta,
        };
        if (userId && lessonId) {
          AsyncStorage.setItem(
            storageKey(userId, lessonId),
            JSON.stringify(newMsgs)
          );
        }
        return newMsgs;
      }
    );
  };

  return { ...query, appendMessage, patchLastAIMessage };
}
