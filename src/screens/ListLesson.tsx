import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getLesson } from "../services/api/lesson.services";
import { useNavigation } from "@react-navigation/native";
import Lesson from "../models/lesson";
import { useDispatch } from "react-redux";
import { setSelectedLesson } from "../features/lesson/lesson.store";
import Constants from "expo-constants";

export default function ListLesson() {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getLesson()
      .then((data) => setLessons(data.data))
      .catch((error) => console.error(error));
  }, []); // ✅ chỉ gọi 1 lần

  const goToLearningWithAI = (lesson: Lesson) => {
    dispatch(setSelectedLesson(lesson));
    navigation.navigate("LearningWithAI" as never);
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => goToLearningWithAI(item)}
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
