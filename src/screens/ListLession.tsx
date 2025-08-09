import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getLession } from "../services/api/lession.services";
import { useNavigation } from "@react-navigation/native";
import Lession from "../models/lession";
import { useDispatch } from "react-redux";
import { setSelectedLession } from "../features/lession/lession.store";

export default function ListLesson() {
  const navigation = useNavigation();
  const [lessions, setLessons] = useState<Lession[]>([]);
  const dispatch = useDispatch();
  
  useEffect(() => {
    getLession()
      .then((data) => 
        {
          // console.log(data.data);
          setLessons(data.data)
        })
      .catch((error) => console.error(error));
  }, [lessions]);

  const goToLearningWithAI = (lession: Lession) => {
    dispatch(setSelectedLession(lession));
    navigation.navigate("LearningWithAI" as never);
  };

  const renderLesson = ({ item }: { item: Lession }) => (
    <TouchableOpacity style={styles.card} onPress={() => goToLearningWithAI(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lessions</Text>
      <FlatList
        data={lessions}
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
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
