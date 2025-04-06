import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ChangeName = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digite seu nome de usuário:</Text>
      <TextInput
        onChangeText={(text) => setUsername(text)}
        placeholderTextColor="gray"
        placeholder="Nome"
        style={styles.textInput}
      />
      <TouchableOpacity
        disabled={username === ''}
        style={[styles.button, username === '' && styles.buttonDisabled]}
        onPress={() => router.replace({ pathname: '/chat', params: { username } })}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 5,
    width: '80%',
    height: 50,
    fontSize: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#3a0ca3',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChangeName;