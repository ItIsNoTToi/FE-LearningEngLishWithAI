import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<QuizStackParamList, 'QuizTopic'>;

const QUIZZES = [
  { id: '1', title: 'Vocabulary Basics' },
  { id: '2', title: 'Advanced Words' },
];

const ListQuizTopic = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 60, }}>
      <FlatList
        data={QUIZZES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Test', { quizId: item.id, quizTitle: item.title })}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: '#eee',
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default ListQuizTopic;
