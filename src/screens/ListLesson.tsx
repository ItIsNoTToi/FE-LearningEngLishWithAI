import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getLesson } from "../services/api/lesson.services";
import { useNavigation } from "@react-navigation/native";
import Lesson from "../models/lesson";
import { useDispatch } from "react-redux";
import { setSelectedLesson } from "../features/lesson/lesson.store";
import { ScrollView } from "react-native-gesture-handler";

export default function ListLesson() {
  const navigation = useNavigation();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const dispatch = useDispatch();
  
  useEffect(() => {
    getLesson()
      .then((data) => 
        {
          // console.log(data.data);
          setLessons(data.data)
        })
      .catch((error) => console.error(error));
  }, [lessons]);


  const goToLearningWithAI = (lesson: Lesson) => {
    dispatch(setSelectedLesson(lesson));
    navigation.navigate("LearningWithAI" as never);
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <TouchableOpacity style={styles.card} onPress={() => goToLearningWithAI(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Lessions</Text>
        <FlatList
          data={lessons}
          keyExtractor={(item) => item._id}
          renderItem={renderLesson}
          contentContainerStyle={styles.list}
        />
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 39,
    paddingTop: 50,
    paddingBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
