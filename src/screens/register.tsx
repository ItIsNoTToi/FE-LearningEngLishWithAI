import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Here you'd usually validate and send to backend
    console.log('Registering with:', email, password);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} />

      <Text style={styles.title}>Create your LearnE Account</Text>
      <Text style={styles.subtitle}>Start your English journey with AI today!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Already have an account?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Log in here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f6ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#4f6ef7',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 8,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  orText: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
  },
  loginText: {
    fontSize: 15,
    color: '#4f6ef7',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
