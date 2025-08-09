import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CompetitionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competition</Text>
      <Text style={styles.subtitle}>
        Danh sách các cuộc thi sẽ được hiển thị ở đây.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
