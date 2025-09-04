// hooks/useChatlog.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchChatlog } from "../services/api/chatlog.services";

type ChatMessage = { from: "user" | "ai"; text: string };

const storageKey = (userId: string, lessonId: string) =>
  `chatlog:${userId}:${lessonId}`;

export function useChatlog(userId?: string, lessonId?: string) {
  // console.log("useChatlog: ", userId, lessonId);

  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["chatlog", userId, lessonId],
    queryFn: async () => {
      if (!userId || !lessonId) return [];

      const key = storageKey(userId, lessonId);

      // 1. Thử lấy từ AsyncStorage
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const raw = JSON.parse(cached);
        return raw.map((m: any) => ({
          from: m.role === "user" ? "user" : "ai",
          text: m.content ?? "",
        })) as ChatMessage[];
      }

      // 2. Nếu không có, gọi API
      const res = await fetchChatlog(userId, lessonId);
      const raw = res?.data?.messages ?? [];

      const messages: ChatMessage[] = raw.map((m: any) => ({
        from: m.role === "user" ? "user" : "ai",
        text: m.content ?? "",
      }));

      // 3. Lưu lại cache
      await AsyncStorage.setItem(key, JSON.stringify(raw));

      return messages;
    },
    enabled: !!userId && !!lessonId,
    staleTime: 1000 * 60,
  });

  const appendMessage = (msg: ChatMessage) => {
    queryClient.setQueryData<ChatMessage[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        const newMsgs = [...old, msg];
        if (userId && lessonId) {
          // Lưu lại ở dạng gốc để sau này dễ map
          AsyncStorage.setItem(
            storageKey(userId, lessonId),
            JSON.stringify(
              newMsgs.map((m) => ({
                role: m.from,
                content: m.text,
              }))
            )
          );
        }
        return newMsgs;
      }
    );
  };

  const patchLastAIMessage = (incoming: string) => {
    if (!userId || !lessonId) return;

    queryClient.setQueryData<{ from: "user" | "ai"; text: string }[]>(
      ["chatlog", userId, lessonId],
      (old = []) => {
        if (!old.length) return old;

        const newMsgs = [...old];
        const last = newMsgs[newMsgs.length - 1];
        if (!last || last.from !== "ai") return old;

        let newText = "";
        if (incoming.startsWith(last.text)) {
          // server trả snapshot => replace toàn bộ text
          newText = incoming;
        } else {
          // server trả delta => nối thêm
          newText = last.text + incoming;
        }

        newMsgs[newMsgs.length - 1] = { ...last, text: newText };

        // lưu cache
        AsyncStorage.setItem(
          `chatlog:${userId}:${lessonId}`,
          JSON.stringify(newMsgs)
        );

        return newMsgs;
      }
    );
  };

  return { data: messages, appendMessage, patchLastAIMessage };
}
