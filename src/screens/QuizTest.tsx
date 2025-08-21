import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Button } from 'react-native';
import { Question } from '../models/question';

const QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What does "Abate" mean?',
    options: [
      { text: 'To increase' },
      { text: 'To become less intense', isCorrect: true },
      { text: 'To talk a lot' },
      { text: 'To build' }
    ],
    explanation: ''
  },
  {
    id: '2',
    question: 'Choose the synonym of "Benevolent".',
    options: [
      { text: 'Kind', isCorrect: true },
      { text: 'Cruel' },
      { text: 'Indifferent' },
      { text: 'Hostile' }
    ],
    explanation: ''
  }
];

export default function QuizTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const question = QUESTIONS[currentIndex];

  const onSelectOption = (index: number) => {
    if (selectedOption === null) {
      setSelectedOption(index);
      setShowResult(true);
    }
  };

  const onNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('Quiz finished!');
      setCurrentIndex(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>

      {question.options.map((option, idx) => {
        const isSelected = idx === selectedOption;
        const isCorrect = !!option.isCorrect; // check trực tiếp trong option
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
            key={idx}
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
          <Button title="Next" onPress={onNext} />
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
