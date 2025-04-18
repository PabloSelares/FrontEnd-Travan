import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import httpService from '../app/services/httpService';

function Register() {
  const [checked, setChecked] = useState('motorista');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState({ value: '', dirty: false });
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState({ value: '', dirty: false });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const router = useRouter();
  const SERVER_URL = 'http://10.5.2.247:3000';

  const handleRegister = async () => {
    setFormSubmitted(true);
    let hasError = false;

    if (!nome || nome.trim().length < 2) {
      hasError = true;
    }

    if (!email.value || !emailRegex.test(email.value)) {
      setEmail({ value: email.value, dirty: true });
      hasError = true;
    }

    if (!telefone || telefone.trim().length < 11) {
      hasError = true;
    }

    if (!senha.value || senha.value.length < 6) {
      setSenha({ value: senha.value, dirty: true });
      hasError = true;
    }

    if (hasError) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente');
      return;
    }

    setIsLoading(true);

    try {
      const json = {
        name: nome,
        email: email.value,
        telefone: telefone,
        password: senha.value,
        tipo: checked,
      };
      const response = await httpService.post(`${SERVER_URL}/api/user`, json);
      const result = await response.data;
      if (result.message === 'User created successfully') {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        router.replace('/login');
      } else {
        Alert.alert('Erro', result.message || 'Erro ao registrar');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorNome = () => {
    if (formSubmitted && nome.trim().length < 2) {
      return <Text style={styles.error}>Nome deve ter pelo menos 2 caracteres</Text>;
    }
    return null;
  };

  const handleErrorEmail = () => {
    if (formSubmitted) {
      if (!email.value) return <Text style={styles.error}>Campo obrigatório</Text>;
      if (!emailRegex.test(email.value)) return <Text style={styles.error}>Email inválido</Text>;
    }
    return null;
  };

  const handleErrorTelefone = () => {
    if (formSubmitted && telefone.trim().length < 11) {
      return <Text style={styles.error}>Telefone deve ter 11 dígitos</Text>;
    }
    return null;
  };

  const handleErrorPassword = () => {
    if (formSubmitted) {
      if (!senha.value) return <Text style={styles.error}>Campo obrigatório</Text>;
      if (senha.value.length < 6) return <Text style={styles.error}>Senha deve ter pelo menos 6 caracteres</Text>;
    }
    return null;
  };

  return (
    <LinearGradient
      colors={['#1a002a', '#3a0ca3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Criar conta:</Text>

        <TextInput
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholderTextColor="black"
        />
        {handleErrorNome()}

        <TextInput
          placeholder="E-mail"
          value={email.value}
          onChangeText={(text) => setEmail({ value: text, dirty: true })}
          style={styles.input}
          placeholderTextColor="black"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {handleErrorEmail()}

        <View style={styles.radioContainer}>
          {['motorista', 'passageiro'].map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.radioOption,
                checked === tipo && styles.radioSelected,
              ]}
              onPress={() => setChecked(tipo)}
            >
              <View style={styles.radioCircle}>
                {checked === tipo && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Telefone (com DDD)"
          value={telefone}
          keyboardType="phone-pad"
          onChangeText={setTelefone}
          style={styles.input}
          placeholderTextColor="black"
        />
        {handleErrorTelefone()}

        <TextInput
          placeholder="Senha"
          value={senha.value}
          onChangeText={(text) => setSenha({ value: text, dirty: true })}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="black"
        />
        {handleErrorPassword()}

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Processando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voltarButton}
          onPress={() => router.replace('/')}
          disabled={isLoading}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

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
  input: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginTop: 20,
    width: '80%',
    height: 50,
    fontSize: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '48%',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  radioSelected: {
    borderColor: '#3a0ca3',
    backgroundColor: 'rgb(245, 245, 245)',
  },
  radioLabel: {
    color: 'black',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#3a0ca3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    height: 7,
    width: 7,
    borderRadius: 5,
    backgroundColor: '#3a0ca3',
  },
  registerButton: {
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a0ca3',
  },
  error: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 3,
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
});

export default Register;
