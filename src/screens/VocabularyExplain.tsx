import React from 'react';
import { Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { VocabularyExplainProps } from '../models/vocabulary';

export default function VocabularyExplain({
  word,
  definition,
  example,
}: VocabularyExplainProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.definition}>{definition}</Text>

        {example ? (
          <>
            <Text style={styles.sectionTitle}>Example:</Text>
            <Text style={styles.example}>{example}</Text>
          </>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 40,  justifyContent: 'center', alignContent: 'center', backgroundColor: '#c7f130ff', width: '100%', height: 50, },
  content: { paddingBottom: 40 },
  word: { fontSize: 32, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  definition: { fontSize: 18, lineHeight: 28, marginBottom: 20, color: '#444' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  example: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 24,
  },
  extraInfo: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});
