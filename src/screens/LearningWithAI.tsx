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
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import type { chatlog } from '../models/chatlog'; // chỉ import type
import { fetchAI, startLessonAI, EndLessonAI } from '../services/api/AI.services';
import { fetchChatlog } from '../services/api/chatlog.services';
import type { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import User from '../models/user';
import { getProfile } from '../services/api/user.services';

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
  const [user, setUser] = useState<User>();

  const selectedLesson = useSelector((state: RootState) => state.lesson.selectedLesson);
  const scrollViewRef = useRef<ScrollView>(null);

  // manager back to screen before
  const navigation = useNavigation();

  useEffect(() =>{
    getProfile().then(data => setUser(data.data));
  },[])
  
  useEffect(() => {
    if (user && selectedLesson?._id) {
      startLessonAI(user._id, selectedLesson._id)
        .then(data => alert(`${data.message}`))
        .catch(console.error);
    }
  }, [user, selectedLesson]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();

      Alert.alert(
        'Xác nhận',
        'Bạn có muốn quay lại không?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Có',
            style: 'destructive',
            onPress: async () => {
              Speech.stop();
              try {
                await EndLessonAI(user?._id, selectedLesson?._id);
              } catch (err) {
                console.error("Failed to finish lesson:", err);
              }
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [user, selectedLesson, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Speech.stop();
      };
    }, [])
  );

  // Load lịch sử chat khi lesson thay đổi
  useEffect(() => {
    if (!selectedLesson || !user) return;

    fetchChatlog(user._id, selectedLesson._id)
      .then(res => {
        if (!res || !res.data) {
          setMessages([]);
          return;
        }

        if (res.message === 'chatlog not found') {
          setMessages([]);
          return;
        }

        if (res.data.messages) {
          setMessages(res.data.messages.map((m: any) => ({
            from: m.role,
            text: m.content,
          })));
        } else {
          setMessages([]);
        }
      })
      .catch(error => {
        console.error('Fetch chatlog error:', error);
        setMessages([]); // fallback
      });
  }, [user, selectedLesson]);

  const handleSend = async () => {
    if (!userInput.trim() || !selectedLesson) return;

    const newMessage = { from: 'user' as const, text: userInput };
    setMessages((prev) => [...prev, newMessage]);

    const sendData = {
      sessionId: '1234',
      userId: user?._id,
      lessonId: selectedLesson._id,
      userSpeechText: userInput,
    };

    setUserInput('');

    try {
      const aiData = await fetchAI(sendData);
      const aiReply = aiData.aiReplyText;

      setMessages((prev) => [...prev, { from: 'ai', text: aiReply }]);
      await speak(aiReply);
    } catch (error) {
      console.error(error);
    }
  };

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!selectedLesson) {
    return <Text>No lesson selected</Text>;
  }

  if (!messages) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{selectedLesson.title}</Text>

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
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
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
