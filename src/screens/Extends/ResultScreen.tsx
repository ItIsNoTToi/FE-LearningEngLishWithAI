import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuizStackParamList } from "../../navigation/AppStack";

type Props = NativeStackScreenProps<QuizStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { score, total, totalscore, quizId } = route.params;


  return (
    <View style={styles.container}>
        <Text style={styles.title}>🎉 Quiz Completed!</Text>
        <Text style={styles.scoreText}>
            Correct answers: { (score/totalscore) * total}/{total}
        </Text>
        <Text style={styles.scoreText}>
            Percentage: {((score / totalscore) * 100).toFixed(1)}%
        </Text>

        <Text style={styles.scoreText}>
            Final Score: {score.toFixed(1)}/{totalscore}
        </Text>

        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("QuizTopic")} 
        >
            <Text style={styles.buttonText}>Back to Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2196F3", marginTop: 12 }]}
            onPress={() =>
                navigation.replace("QuizTest", { quizId: quizId }) 
            }
        >
            <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
