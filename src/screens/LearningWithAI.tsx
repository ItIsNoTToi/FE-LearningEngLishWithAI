// screens/LearningWithAI.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, Alert, FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useChatlog } from "../hooks/useChatlog";
import { fetchAIStream, startLessonAI, EndLessonAI } from "../services/api/AI.services";
import { getProfile } from "../services/api/user.services";
import { makeAIKey, getCachedAI, setCachedAI } from "../services/aiCache";
import User from "../models/user";

async function speak(text: string) {
  Speech.speak(text, { language: "en", pitch: 1.0, rate: 1.0 });
}

export default function LearningWithAI() {
  const [userInput, setUserInput] = useState("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigation = useNavigation<any>();
  const selectedLesson = useSelector((s: RootState) => s?.lesson.selectedLesson);
  const flatRef = useRef<FlatList<{ from: "user" | "ai"; text: string }>>(null);

  // profile: load 1 lần, nên cache ở AsyncStorage phía service (như bạn đã có)
  useEffect(() => {
    getProfile().then((data) => setUser(data.data)).catch(console.error);
  }, []);

  // start/finish lesson
  useEffect(() => {
    if (!user || !selectedLesson?._id) return;
    let mounted = true;
    startLessonAI(user._id, selectedLesson._id)
      .then((d) => mounted && Alert.alert("Info", d.message))
      .catch(console.error);
    return () => { mounted = false; };
  }, [user, selectedLesson]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      Alert.alert("Xác nhận", "Bạn có muốn quay lại không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            Speech.stop();
            try {
              await EndLessonAI(user?._id, selectedLesson?._id)
                .then((d) => Alert.alert("Info", d.message))
                .catch(console.error);
            } catch (err) {
              console.error("Failed to finish lesson:", err);
            }
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });
    return unsubscribe;
  }, [user, selectedLesson, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      return () => { Speech.stop(); };
    }, [])
  );

  // dùng hook cache chatlog
  const { data: messages = [], appendMessage, patchLastAIMessage } =
    useChatlog(user?._id, selectedLesson?._id);

  // auto scroll cuối khi messages đổi
  useEffect(() => {
    flatRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!selectedLesson) return <Text>No lesson selected</Text>;

  // --- Gửi tin nhắn ---
  const handleSend = async () => {
    if (!userInput.trim() || !selectedLesson?._id || !user?._id) return;

    const prompt = userInput;
    const cacheKey = makeAIKey(selectedLesson._id, prompt);

    // 1) append message user
    appendMessage({ from: "user", text: prompt });

    // 2) Nếu đã có câu trả lời trong cache → dùng luôn, không gọi API
    const cached = getCachedAI(cacheKey);
    if (cached) {
      appendMessage({ from: "ai", text: cached });
      setUserInput("");
      return;
    }

    // 3) Nếu chưa có, bắt đầu 1 message rỗng cho AI và stream
    appendMessage({ from: "ai", text: "" });
    setUserInput("");

    let es: EventSource | null = null;
    let fullText = "";

    try {
      es = fetchAIStream(
        {
          sessionId: "1234",
          userId: user._id,
          lessonId: selectedLesson._id,
          userSpeechText: prompt,
        },
        (delta: string) => {
          fullText += delta;
          patchLastAIMessage(delta); // cập nhật dần dần UI + cache
        },
        () => {
          // hoàn tất: lưu cache để lần sau không gọi lại
          setCachedAI(cacheKey, fullText);
          // tuỳ chọn: đọc to
          // speak(fullText);
        }
      ) as unknown as EventSource;
    } catch (err) {
      console.error("fetchAIStream error:", err);
    } finally {
      // đảm bảo cleanup khi unmount/leave (phòng memory leak)
      // (ở đây đã close trong onDone/error của fetchAIStream, phòng hờ thêm)
      // es?.close?.();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{selectedLesson.title}</Text>

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(_, idx) => String(idx)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.from === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type in English..."
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, paddingTop: 45, paddingHorizontal: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginVertical: 8, paddingBottom: Platform.OS === "ios" ? 20 : 0 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: "80%" },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  messageText: { color: "#000", fontSize: 16 },
  sendButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 24, marginLeft: 8 },
});
