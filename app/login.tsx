import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import httpService from '../app/services/httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState({ value: '', dirty: false });
  const [password, setPassword] = useState({ value: '', dirty: false });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SERVER_URL = 'http://192.168.15.105:3000';

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('token', value);
    } catch (e) {
      console.error("Erro ao armazenar o token:", e);
    }
  };

  const handleLogin = async () => {
    try {
      const json = {
        email: email.value,
        password: password.value,
      };
      const response = await httpService.post(`${SERVER_URL}/api/user/login`, json);
      const result = await response.data;

      if (response.status == 200) {
        const user = result.user;

        const token = result.token;

        await storeData(token);
        router.push({
          pathname: "/(tabs)/home",
          params: {
            email: email.value,
          },
        })
      } else if (result.status === 400) {
        handleErrorEmail();
        handleErrorPassword();
      } else {
        alert("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } catch (error) {

      handleErrorForm();
      console.error("Erro na requisição:", error);
      alert("Erro de conexão. Verifique sua internet ou tente novamente mais tarde.");
    }
  }


  const handleErrorEmail = () => {
    if (!email.value && email.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (!emailRegex.test(email.value) && email.dirty) {
      return <Text style={styles.error}>Email inválido</Text>;
    }
    return null;
  };

  const handleErrorPassword = () => {
    if (!password.value && password.dirty) {
      return <Text style={styles.error}>Campo obrigatório</Text>;
    } else if (password.value.length < 6 && password.dirty) {
      return <Text style={styles.error}>Senha deve ter pelo menos 6 caracteres</Text>;
    }
    return null;
  };

  const handleErrorForm = () => {
    let hasError = false;

    if (!email.value || !emailRegex.test(email.value)) {
      setEmail({ value: email.value, dirty: true });
      hasError = true;
    }

    if (!password.value) {
      setPassword({ value: password.value, dirty: true });
      hasError = true;
    }

    if (!hasError) {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <LinearGradient
      colors={["#1a002a", "#3a0ca3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="account-circle" size={100} style={{ color: "#3a0ca3" }} />
          <Text style={styles.title}>TraVan</Text>
        </View>

        <TextInput
          onChangeText={(text) => setEmail({ value: text, dirty: true })}
          placeholder="E-mail"
          style={styles.input}
          placeholderTextColor="#000"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {handleErrorEmail()}

        <TextInput
          onChangeText={(text) => setPassword({ value: text, dirty: true })}
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#000"
        />
        {handleErrorPassword()}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.voltarButton} onPress={() => router.replace('/')}>
          <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    borderRadius: 15,
    width: '88%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a0ca3',
    marginTop: 10,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    height: 50,
    fontSize: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loginButton: {
    backgroundColor: '#3a0ca3',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  voltarButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  voltarButtonText: {
    color: '#64748B',
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 3,
  },
});

export default Login;
