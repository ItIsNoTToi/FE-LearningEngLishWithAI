import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ReadStackParamList } from '../../navigation/AppStack';

const ReadingDetailScreen = () => {
  const route = useRoute<RouteProp<ReadStackParamList, 'ReadingDetail'>>();
  const { item } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Tiêu đề */}
      <Text style={styles.title}>{item.title}</Text>

      {/* Nội dung bài đọc */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📖 Content</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>

      {/* Vocabulary */}
      <View style={styles.vocabSection}>
        <Text style={styles.sectionTitle}>📝 Vocabulary</Text>
        {item.vocabulary?.map((vocab, index) => (
          <View key={index} style={styles.vocabItem}>
            <Text style={styles.vocabWord}>
              {index + 1}. {vocab.word}
            </Text>
            <Text style={styles.vocabMeaning}>{vocab.meaning}</Text>
            {vocab.example ? (
              <Text style={styles.vocabExample}>"{vocab.example}"</Text>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ReadingDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#1e293b' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#334155' },
  content: { fontSize: 16, lineHeight: 24, color: '#374151' },

  vocabSection: {
    marginTop: 10,
  },
  vocabItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  vocabWord: { fontSize: 17, fontWeight: '700', marginBottom: 4, color: '#1e40af' },
  vocabMeaning: { fontSize: 15, color: '#374151', marginBottom: 4 },
  vocabExample: { fontSize: 14, fontStyle: 'italic', color: '#64748b' },
});
