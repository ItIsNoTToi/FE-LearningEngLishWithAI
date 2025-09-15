import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ReadStackParamList } from '../../navigation/AppStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getLesson } from '../../services/api/lesson.services';
import Lession from '../../models/lesson';

type Props = NativeStackScreenProps<ReadStackParamList, 'ReadingTopics'>;

const ReadingTopicsScreen = ({ navigation }: Props) => {
  const [topics, setTopics] = useState<Lession[]>([]);

  useEffect(() => {
    getLesson().then((data) => setTopics(data.data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Reading Topics</Text>
      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ReadingDetail', { item })}
          >
            <Text style={styles.index}>{index + 1}.</Text>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ReadingTopicsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 40 },
  header: { 
    fontSize: 26, 
    fontWeight: '800', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#1e293b' 
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  index: { fontSize: 18, fontWeight: '700', marginRight: 8, color: '#1d4ed8' },
  title: { fontSize: 18, fontWeight: '500', color: '#334155', flexShrink: 1 },
});
