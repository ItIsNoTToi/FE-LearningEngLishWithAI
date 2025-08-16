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

// const SAMPLE_VOCAB: Vocabulary[] = [
//   { id: '1', word: 'Abate', definition: 'To become less intense or widespread.', example: ['The storm will abate by tomorrow.'] },
//   { id: '2', word: 'Benevolent', definition: 'Well meaning and kindly.', example: ['She had a benevolent smile.'] },
//   // Add more words here...
// ];

export default function VocabularyPage() {
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<Vocabulary | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);

  useEffect(()=>{
    GetVocabulary()
    .then( (data) => {
      console.log(data.data);
      setVocabulary(data.data);
    })
  },[])

  const filteredData = vocabulary.filter(item =>
    item.word.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedWord) {
    // Hiển thị màn VocabularyExplain khi có từ được chọn
    return (
      <SafeAreaView style={{ flex: 1, }}>
        <VocabularyExplain
          word={selectedWord.word}
          definition={selectedWord.meaning}
          example={selectedWord.example[0]} // lấy ví dụ đầu tiên nếu có
        />
        <View style={{ padding: 16 }}>
          <Button title="Back" color={'#c7f130ff'} onPress={() => setSelectedWord(null)} />
        </View>
      </SafeAreaView>
    );
  }

  // Màn danh sách từ vựng + tìm kiếm
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>Vocabulary</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search word..."
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer} onPress={() => setSelectedWord(item)}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.definition}>{item.meaning}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No words found.</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 25 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 16, textAlign: 'center' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  word: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  definition: {
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#999',
  },
});
