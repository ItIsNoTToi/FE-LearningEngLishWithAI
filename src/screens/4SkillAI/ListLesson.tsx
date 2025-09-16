import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getLesson } from "../../services/api/lesson.services";
import Lesson from "../../models/lesson";
import User from '../../models/user';
import { useDispatch } from "react-redux";
import { setLesson } from "../../redux/slices/lesson.store";
import Constants from "expo-constants";
import { progress } from "../../models/progress";
import {fetchProgressApi} from "../../services/api/progress.services";
import { getUser } from "../../services/api/user.services";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LessonStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<LessonStackParamList, 'ListLesson'>;

export default function ListLesson({ navigation }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [user, setUser] = useState<User>();
  const [progresses, setProgresses] = useState<progress[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser()
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

  const goToLesson = (lesson: Lesson, type: string) => {
    try{
      // console.log(1)
      dispatch(setLesson(lesson));
      if(type === 'listening'){
        navigation.navigate("ListenChat", { type: type });
      } else if(type === 'reading'){
        navigation.navigate("ReadChat", { type: type });
      } else if(type === 'speaking'){
        navigation.navigate("SpeakChat", { type: type });
      } else{
        navigation.navigate("WriteChat", { type: type });
      }
      // console.log(2)
    } catch (e) {
      console.log(e);
    }
  };

  const renderLesson = ({ item, index }: { item: Lesson, index: number }) => (
    <TouchableOpacity
      style={[styles.card, isLessonDisabled(index) && { opacity: 0.5 }]}
      disabled={isLessonDisabled(index)} 
      activeOpacity={0.7}
      onPress={() => goToLesson(item, item.type)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>📘</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description} - {item.type}
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
