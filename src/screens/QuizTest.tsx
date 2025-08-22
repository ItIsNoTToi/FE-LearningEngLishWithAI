import React, { useEffect, useState } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Button } from 'react-native';
import { Question } from '../models/question';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizStackParamList } from '../navigation/AppStack';
import { getQuestionByQuizId, SaveHistoryQuiz } from '../services/api/quiz.services';

type Props = NativeStackScreenProps<QuizStackParamList, 'Test'>;

export default function QuizTest({ route, navigation }: Props) {
  const { quizId } = route.params;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalscore, setTotalScore] = useState(0);

  useEffect(() => {
    getQuestionByQuizId(quizId)
      .then(data => {
        // console.log(data);
        // Kiểm tra nếu data.data tồn tại và có ít nhất một câu hỏi
        if (data?.data?.length > 0) {
          setQuestions(data.data);
          setTotalScore(data.score);
        }
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, [quizId]);

  if (questions.length === 0) {
    return <Text>Loading...</Text>;
  }

  const question = questions[currentIndex];

  const onSelectOption = (index: number) => {
    if (selectedOption === null) {
      setSelectedOption(index);
      setShowResult(true);

      // Nếu chọn đúng thì cộng điểm
      if (question.options[index].isCorrect) {
        setScore(prev => prev + totalscore / questions.length);
      }
    }
  };

  const onNext = () => {
    setSelectedOption(null);
    setShowResult(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const percent = (score / questions.length) * 100;

      SaveHistoryQuiz(quizId, score, questions.length, percent)
        .then((data) => {
          if (data.success) {
            navigation.navigate("Result", {
              score,
              total: questions.length,
              totalscore, // ví dụ 100
              quizId
            });
          }
        })
        .catch(error => console.error('Error saving quiz history:', error));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.questionText}>{question.questionText}</Text>

      {question.options.map((option, idx) => {
        const isSelected = idx === selectedOption;
        const isCorrect = !!option.isCorrect;
        let backgroundColor = '#eee';

        if (showResult) {
          if (isSelected) {
            backgroundColor = isCorrect ? '#4CAF50' : '#F44336';
          } else if (isCorrect) {
            backgroundColor = '#4CAF50';
          }
        } else if (isSelected) {
          backgroundColor = '#ccc';
        }

        return (
          <TouchableOpacity
            key={option._id}
            style={[styles.optionButton, { backgroundColor }]}
            onPress={() => onSelectOption(idx)}
            disabled={showResult}
          >
            <Text style={styles.optionText}>{option.text}</Text>
          </TouchableOpacity>
        );
      })}

      {showResult && (
        <View style={styles.resultContainer}>
          <Text style={{ fontSize: 18 }}>
            {selectedOption !== null && question.options[selectedOption].isCorrect
              ? 'Correct!'
              : 'Wrong!'}
          </Text>

          {/* hiện explanation nếu có */}
          {question.explanation && (
            <Text style={{ marginTop: 8, fontStyle: 'italic' }}>
              {question.explanation}
            </Text>
          )}

          <Button title={currentIndex === questions.length - 1 ? "Finish" : "Next"} onPress={onNext} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
  questionText: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: { fontSize: 18 },
  resultContainer: { marginTop: 20, alignItems: 'center' },
});
