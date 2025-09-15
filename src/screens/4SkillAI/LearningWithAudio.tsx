import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { getLessonAudio, sendAnswer } from "../../services/api/listen.services";
import User from "../../models/user";
import { getProfile } from "../../services/api/user.services";
import Constants from "expo-constants";
import { Audio } from "expo-av";

export default function LearningWithAudio() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const selectedLesson = useSelector((s: RootState) => s.lesson.selectedLesson);

  useEffect(() => {
    getProfile().then((data) => setUser(data.data)).catch(console.error);

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() =>{
    if (!selectedLesson?._id) return;
    try {
      getLessonAudio(selectedLesson._id)
      .then(data =>{
        // console.log("data", data);
        setAudioUri(data.audioUri);
        setText(data.text);
      });
    } catch (err) {
      console.error("Error starting lesson:", err);
    }
  },[]);

  const playAudio = async () => {
    if (!audioUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    await sound.playAsync();
  };

  const submitAnswer = () => {
    if (!selectedLesson?._id || !userAnswer.trim()) return;
    sendAnswer(selectedLesson._id, userAnswer, setFeedback);
  };

  return (
    <View style={styles.container}>
          <TouchableOpacity
            onPress={playAudio}
            style={{ backgroundColor: "orange", padding: 12, borderRadius: 8, marginTop: 12 }}
          >
            <Text>▶ Play Audio</Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 12, fontSize: 16 }}>{text}</Text>

          <TextInput
            placeholder="Your answer..."
            value={userAnswer}
            onChangeText={setUserAnswer}
            style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
          />
          <Button title="Send Answer" onPress={submitAnswer} />

      {feedback ? (
        <Text style={{ marginTop: 12, fontWeight: "bold" }}>AI Feedback: {feedback}</Text>
      ) : null}

      {audioUri ? (
        <TouchableOpacity
          onPress={() => console.log("Finish lesson")}
          style={{
            backgroundColor: "green",
            padding: 12,
            borderRadius: 8,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Finish Lesson</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight + 20,
  },
});
