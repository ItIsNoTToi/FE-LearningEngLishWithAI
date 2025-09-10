import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { playLessonAudio, sendAnswer } from "../services/api/listen.services";
import User from "../models/user";
import { getProfile } from "../services/api/user.services";
import Constants from "expo-constants";

export default function LearningWithAudio() {
    const [question, setQuestion] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        getProfile().then((data) => setUser(data.data)).catch(console.error);
    }, []);

    const selectedLesson = useSelector((s: RootState) => s.lesson.selectedLesson);

    const startLesson = () => {
        if (!user?._id || !selectedLesson?._id) return;
        // console.log(user?._id, selectedLesson?._id);
        playLessonAudio(user._id, selectedLesson._id, setQuestion);
    };

    const submitAnswer = () => {
        if (!selectedLesson?._id || !userAnswer.trim()) return;
        sendAnswer(selectedLesson._id, userAnswer, setFeedback);
    };
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={startLesson} style={{ backgroundColor: "lightblue", padding: 12, borderRadius: 8, }}>
                <Text>Start Lesson</Text>
            </TouchableOpacity>

            {question ? (
                <>
                <Text style={{ marginVertical: 12 }}>{question}</Text>
                <TextInput
                    placeholder="Your answer..."
                    value={userAnswer}
                    onChangeText={setUserAnswer}
                    style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
                />
                <Button title="Send Answer" onPress={submitAnswer} />
                </>
            ) : null}

            {feedback ? (
                <Text style={{ marginTop: 12, fontWeight: "bold" }}>AI Feedback: {feedback}</Text>
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