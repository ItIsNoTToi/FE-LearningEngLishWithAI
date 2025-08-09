import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { ListeningItem } from '../models/ListeningItem';

const LISTENING_DATA: ListeningItem[] = [
  {
    id: '1',
    text: 'Abate',
    audioUri: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/abate--_gb_1.mp3',
  },
  {
    id: '2',
    text: 'Benevolent',
    audioUri: 'https://ssl.gstatic.com/dictionary/static/sounds/oxford/benevolent--_gb_1.mp3',
  },
  // Thêm data nếu cần
];

export default function Listening() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (item: ListeningItem) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      setLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: item.audioUri });
      setSound(newSound);
      setPlayingId(item.id);
      setLoading(false);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && !status.isPlaying) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error('Error playing sound:', error);
      setLoading(false);
      setPlayingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Listening Practice</Text>

      {LISTENING_DATA.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.text}>{item.text}</Text>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => playSound(item)}
            disabled={loading && playingId === item.id}
          >
            <Text style={styles.playButtonText}>
              {playingId === item.id ? (loading ? 'Loading...' : 'Playing') : 'Play'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  text: { fontSize: 20 },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  playButtonText: { color: '#fff', fontWeight: '600' },
});
