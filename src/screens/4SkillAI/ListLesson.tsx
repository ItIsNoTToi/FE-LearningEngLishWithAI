import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getLesson } from "../../services/api/lesson.services";
import { useNavigation } from "@react-navigation/native";
import Lesson from "../../models/lesson";
import User from '../../models/user';
import { useDispatch } from "react-redux";
import { setSelectedLesson } from "../../features/lesson/lesson.store";
import Constants from "expo-constants";
import { progress } from "../../models/progress";
import {fetchProgressApi} from "../../services/api/progress.services";
import { getProfile } from "../../services/api/user.services";
import { useFocusEffect } from "@react-navigation/native";

export default function ListLesson() {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [user, setUser] = useState<User>();
  const [progresses, setProgresses] = useState<progress[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getProfile()
      .then(data => setUser(data.data))
      .catch(error => console.error(error));
  }, []);

  // Khi user đã có, mới fetch progress
  useFocusEffect(
    useCallback(() => {
      getLesson()
      .then((data) => setLessons(data.data))
      .catch((error) => console.error(error));
      if (user?._id) {
        fetchProgressApi(user._id)
          .then((data) => setProgresses(data.data))
          .catch((error) => console.error(error));
      }
    }, [user])
  );

  const isLessonDisabled = (index: number) => {
    if (index === 0) return false; // Bài đầu luôn mở
    const prevLesson = lessons[index - 1];
    const prevProgress = progresses.find(
      p =>
        (typeof p.lesson === "string" && p.lesson === prevLesson._id) ||
        // Nếu có trường hợp populate object:
        (typeof p.lesson === "object" && "._id" in p.lesson && p.lesson._id === prevLesson._id)
    );
    return !(prevProgress && prevProgress.status === "completed");
  };

  const goToLesson = (lesson: Lesson) => {
    dispatch(setSelectedLesson(lesson));
    //Practice mode (AI hỏi trước): Giúp học viên có hướng dẫn, luyện tập structured.
    //Free chat mode (người học hỏi): Giúp luyện phản xạ, tự do sáng tạo.
    Alert.alert(
      "Chọn chế độ học",
      "Bạn muốn luyện tập như thế nào?",
      [
        { text: "Practice Mode", onPress: () => navigation.navigate("LearningWithAI" as never) },
        { text: "Free Chat Mode", onPress: () => navigation.navigate("AskingAI" as never) },
        { text: "Hủy", style: "cancel" }
      ]
    );
  };

  const renderLesson = ({ item, index }: { item: Lesson, index: number }) => (
    <TouchableOpacity
      style={[styles.card, isLessonDisabled(index) && { opacity: 0.5 }]}
      disabled={isLessonDisabled(index)} 
      activeOpacity={0.7}
      onPress={() => goToLesson(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>📘</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  // if(lessons){
  //   console.log(lessons);
  // }

  // if(progresses){
  //   console.log(progresses);
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
      />
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
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e293b",
  },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  icon: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 18, fontWeight: "600", color: "#334155", flexShrink: 1 },
  description: { fontSize: 15, color: "#64748b", lineHeight: 20 },
});
