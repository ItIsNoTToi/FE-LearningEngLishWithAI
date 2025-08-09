import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as Speech from 'expo-speech';
import type { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAI } from '../services/api/AI.services';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

async function speak(text: string) {
  Speech.speak(text, {
    language: 'en',
    pitch: 1.0,
    rate: 1.0,
  });
}

const LearningWithAI = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);

  const selectedLession = useSelector((state: RootState) => state.lession.selectedLession);
  if (!selectedLession ) {
    return <Text>No lesson selected</Text>;
  }

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage: { from: 'user'; text: string } = { from: 'user', text: userInput };
    setMessages(prev => [...prev, newMessage]);

    try {
      const data = {
        sessionId: '1234',
        userId: '68917f4d310af0a917685528',
        lessionId: selectedLession._id,
        userSpeechText: userInput
      };
      
      setUserInput('');

      fetchAI(data)
        .then( async (data) => {
          const aiReply = data.aiReplyText;
          setMessages(prev => [...prev, { from: 'ai', text: aiReply }]);
          await speak(aiReply);;
        })
        .catch(console.error);
    } catch (error) {
      console.error(error);
    }
  };

  // Scroll xuống cuối mỗi khi có tin nhắn mới
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Tùy chỉnh offset cho bàn phím ios
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{selectedLession.title}</Text>

        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <Text
              key={idx}
              style={msg.from === 'user' ? styles.userMessage : styles.aiMessage}
            >
              {msg.from === 'user' ? '🧑: ' : '🤖: '}
              {msg.text}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Ask me anything in English..."
            style={styles.input}
            autoFocus
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LearningWithAI;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 45,
    paddingHorizontal: 16,
  },
  chatBox: {
    flex: 1,
    marginHorizontal: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // tránh bị che trên ios
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  sendText: { color: 'white', fontWeight: 'bold' },
});
