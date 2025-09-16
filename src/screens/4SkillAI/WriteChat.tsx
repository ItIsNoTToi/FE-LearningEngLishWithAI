// screens/LearningWithAI.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, Alert, FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useChatlog } from "../../hooks/useChatlog";
import { fetchAIStream, startLessonAI, EndLessonAI, PauseLessonAI } from "../../services/api/AI.services";
import { getUser } from "../../services/api/user.services";
import User from "../../models/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";

type Props = NativeStackScreenProps<LessonStackParamList, 'WriteChat'>;

async function speak(text: string) {
  Speech.speak(text, { language: "en", pitch: 1.0, rate: 1.0 });
}

export default function WriteChat({ route, navigation }: Props) {
  const [userInput, setUserInput] = useState("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const selectedLesson = useSelector((s: RootState) => s?.lesson.selectedLesson);
  const flatRef = useRef<FlatList<any>>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [sending, setSending] = useState(false);
  const [lessonEnded, setLessonEnded] = useState(false);
  const { type } = route.params;

  // load profile
  useEffect(() => {
    getUser().then((data) => setUser(data.data)).catch(console.error);
  }, []);

  // start lesson → AI hỏi trước
  const { data: messages = [], appendMessage, patchLastAIMessage } =
    useChatlog(user?._id, selectedLesson?._id);

  useEffect(() => {
    if (!user || !selectedLesson?._id) return;
    if (messages.length > 0) return; // Nếu đã có chatlog thì không gọi startLessonAI
    let mounted = true;
    (async () => {
      try {
        const d = await startLessonAI(user._id, selectedLesson._id, type);
        if (mounted) {
          // console.log(d);
          Alert.alert("Info", d.message);
          appendMessage({ from: "ai", text: d.firstQuestion });
          speak(d.firstQuestion);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { mounted = false; };
  }, [user, selectedLesson, messages.length]);

  // confirm before leaving
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (isEnding) {
        return;
      }
      e.preventDefault();
      Alert.alert("Xác nhận", "Bạn có muốn quay lại không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            Speech.stop();
            try {
              await PauseLessonAI(user?._id, selectedLesson?._id)
                .then((d) => Alert.alert("Info", d.message))
                .catch(console.error);
            } catch (err) {
              console.error("Failed to Pause lesson:", err);
            }
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });
    return unsubscribe;
  }, [user, selectedLesson, navigation, isEnding]);

  const BtnEnd = async () => {
    Alert.alert("Xác nhận", "Bạn có muốn kết thúc bài học không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          setIsEnding(true);
          Speech.stop();
          if (!user?._id || !selectedLesson?._id) return;
          try {
            await EndLessonAI(user._id, selectedLesson._id)
              .then((d) => Alert.alert("Info", d.message))
              .catch(console.error);
          } catch (err) {
            console.error("Failed to finish lesson:", err);
          }
          // Quay lại màn trước
          navigation.goBack();
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => { Speech.stop(); };
    }, [])
  );

  // auto scroll khi có tin nhắn mới
  // useEffect(() => {
  //   flatRef.current?.scrollToEnd({ animated: true });
  // }, [messages]);
  useEffect(() => {
    if (messages.length > 0) {
      flatRef.current?.scrollToOffset({
        offset: messages.length * 100, // ước lượng chiều cao 1 item ~100
        animated: true,
      });
    }
  }, [messages]);

  if (!selectedLesson) return <Text>No lesson selected</Text>;

  // --- Gửi câu trả lời ---
  const handleSend = async () => {
    if (sending) return; 
    setSending(true);

    if (!userInput.trim() || !selectedLesson?._id || !user?._id) {
      setSending(false);
      return;
    }

    const studentAnswer = userInput.trim();
    appendMessage({ from: "user", text: studentAnswer });
    setUserInput("");

    appendMessage({ from: "ai", text: "" });
    let fullText = "";

    try {
      fetchAIStream(
        {
          userId: user._id,
          lessonId: selectedLesson._id,
          userSpeechText: studentAnswer,
        },
        (parsed) => {
          if (parsed.delta) {
            fullText += parsed.delta;
            patchLastAIMessage(parsed.delta);
          }
        },
        () => { // DONE
          if (fullText) speak(fullText);
          setSending(false);
        },
        () => { // END
          // console.log("Received [END], setLessonEnded true");
          setLessonEnded(true);
          setSending(false);
        }
      );
    } catch (err) {
      setSending(false);
      console.error("fetchAIStream error:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Lesson: {selectedLesson.title} - {selectedLesson.type}</Text>

        <FlatList
          ref={flatRef}
          data={messages}
          extraData={messages}
          keyExtractor={(_, idx) => String(idx)} 
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.from === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageText}>
                {typeof item.text === "string" ? item.text : JSON.stringify(item.text)}
              </Text>
            </View>
          )}
          onContentSizeChange={() => {
            flatRef.current?.scrollToEnd({ animated: true });
          }}
        />
        {lessonEnded && (
          <TouchableOpacity
            style={{ padding: 12, backgroundColor: "red", borderRadius: 8, margin: 16 }}
            onPress={BtnEnd}
          >
            <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
              Finish
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Your answer..."
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            disabled={sending}
            onPress={handleSend}
            style={[styles.sendButton, sending && { opacity: 0.5 }]}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
};

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
