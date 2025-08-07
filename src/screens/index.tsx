import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/AuthContext';

export default function HomeScreen() {
  const {logout} = useAuth();

  const HandleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Text style={{ marginTop: 20 }} onPress={HandleLogout}>
        Log out
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});