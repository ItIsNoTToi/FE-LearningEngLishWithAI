import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

export default function SpeakChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Thêm tin nhắn mới
  const appendMessage = (msg: any) => {
    setMessages((prev) => [...prev, msg]);
  };

  // --- Gửi text ---
  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = { from: "user", text: inputText };
    appendMessage(userMsg);
    setInputText("");
    await handleAIResponse(userMsg.text);
  };

  // --- Gửi audio ---
  const sendAudio = async (uri: string) => {
    try {
      setIsSending(true);
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "speech.m4a",
        type: "audio/m4a"
      } as any);

      const res = await fetch("http://localhost:3000/api/speak/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.transcript) {
        appendMessage({ from: "user", text: data.transcript });
        await handleAIResponse(data.transcript);
      }
    } catch (err) {
      console.error("sendAudio error", err);
      Alert.alert("Lỗi", "Không gửi được audio");
    } finally {
      setIsSending(false);
    }
  };

  // --- AI trả lời + đọc TTS ---
  const handleAIResponse = async (text: string) => {
    const reply = `AI trả lời dựa trên: ${text}`;
    appendMessage({ from: "ai", text: reply });
    Speech.speak(reply, { language: "en" });
  };

  // --- Start recording ---
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Cần cấp quyền micro");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });
      await rec.startAsync();
      setRecording(rec);
      console.log("Recording started");
    } catch (err) {
      console.error("startRecording error", err);
    }
  };

  // --- Stop recording ---
  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    if (uri) await sendAudio(uri);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.from === "user" ? styles.user : styles.ai
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.controls}>
        {/* Nút record */}
        {!recording ? (
          <TouchableOpacity style={styles.btn} onPress={startRecording}>
            <Text>🎙️ Nói</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={stopRecording}>
            <Text>⏹ Dừng</Text>
          </TouchableOpacity>
        )}

        {/* Nhập text thủ công */}
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity style={styles.btn} onPress={sendMessage} disabled={isSending}>
          <Text>➡️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  msg: { padding: 8, margin: 4, borderRadius: 8 },
  user: { backgroundColor: "#cce5ff", alignSelf: "flex-end" },
  ai: { backgroundColor: "#e2e2e2", alignSelf: "flex-start" },
  controls: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 5
  },
  btn: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8
  }
});
