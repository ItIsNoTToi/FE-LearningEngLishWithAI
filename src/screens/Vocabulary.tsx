import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
} from 'react-native';
import Vocabulary from '../models/vocabulary';
import VocabularyExplain from './VocabularyExplain';
import { GetVocabulary } from '../services/api/vocabulary.servics';

export default function VocabularyPage() {
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  useEffect(() => {
    GetVocabulary().then((data) => {
      setVocabulary(data.data);
    });
  }, []);

  const filteredData = vocabulary.filter((item) =>
    item.word.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedWord) {
    return (
      <SafeAreaView style={styles.container}>
        <VocabularyExplain
          word={selectedWord.word}
          definition={selectedWord.meaning}
          example={selectedWord.example[0]}
        />
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedWord(null)}
          >
            <Text style={styles.backText}>⬅ Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>📖 Vocabulary</Text>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search word..."
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => setSelectedWord(item)}
            >
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.definition}>{item.meaning}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>⚠ No words found.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9fafc', 
    paddingHorizontal: 16, 
    paddingTop: 25 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 16, 
    textAlign: 'center', 
    color: '#333' 
  },
  searchWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 6,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#2a2a2a',
  },
  definition: {
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#999',
  },
  backButton: {
    backgroundColor: "#4f9deb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
