import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const LearningWithAI = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessage: { from: 'user' | 'ai'; text: string } = { from: 'user', text: userInput };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer YOUR_OPENAI_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful English teacher.' },
            { role: 'user', content: userInput },
          ],
        }),
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      setMessages((prev) => [...prev, { from: 'ai', text: aiReply }]);
      setUserInput('');
    } catch (error) {
      console.error(error);
    }
  };

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Learn English with AI</Text>

        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{ paddingBottom: 10 }}
          ref={scrollViewRef}
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
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, marginTop: 25 },
  chatBox: { flex: 1, marginBottom: 10 },
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 8, // tránh bị che
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
