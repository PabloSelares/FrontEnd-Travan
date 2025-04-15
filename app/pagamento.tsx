import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import httpService from '../app/services/httpService';
import AsyncStorage from "@react-native-async-storage/async-storage";

function Pagamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const valorFinal = Number(params.valorFinal) || 0;
  const email = params.email as string;
  const nome = params.nome as string;
  const id = params.id as string;
  const idComprador = params.idComprador as string;
  const origem = params.origem as string;
  const destino = params.destino as string;
  const [formaPagamento, setFormaPagamento] = useState("");
  const opcoesPagamento = ["Cartão de Crédito", "Pix", "Boleto"];
  const SERVER_URL = 'http://192.168.15.105:3000';
  useEffect(() => {
    if (valorFinal <= 0) {
      Alert.alert("Valor inválido.");
      router.replace("/home");
    }
  }, []);

  const realizarPagamento = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Alert.alert("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!formaPagamento) {
      Alert.alert("Selecione uma forma de pagamento.");
      return;
    }

    try {
      console.log("nome comprador ", nome);
      console.log("email comprador ", email);
      console.log("id comprador ", idComprador);
      console.log("id produto ", id)


      const message = `Pagamento da viagem de ${nome} saindo de ${origem} para ${destino} realizado com sucesso! Em breve enviaremos um email para ${email} com os detalhes da sua viagem.`;

      const json = {
        produto: id,
        comprador: idComprador,
        message: message,
      }
        ;
      const response = await httpService.post(
        `${SERVER_URL}/api/compra`,
        json,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      )

      if (response.status !== 201) {
        throw new Error();
      }
      Alert.alert(
        "Pagamento confirmado com sucesso!",
        "Clique em OK para voltar à tela inicial.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/(tabs)/home",
                params: {
                  email: email,
                },
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (err) {
      console.error("Erro ao realizar o pagamento:", err);
      Alert.alert("Erro ao realizar o pagamento. Tente novamente.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💳 Pagamento</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Origem:</Text>
        <Text style={styles.value}>{origem}</Text>

        <Text style={styles.label}>Destino:</Text>
        <Text style={styles.value}>{destino}</Text>

        <Text style={styles.label}>Valor Final:</Text>
        <Text style={styles.valor}>R$ {valorFinal.toFixed(2)}</Text>
      </View>

      <Text style={styles.label}>Escolha a forma de pagamento:</Text>
      {opcoesPagamento.map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[
            styles.pagamentoButton,
            formaPagamento === opcao && styles.pagamentoSelecionado,
          ]}
          onPress={() => setFormaPagamento(opcao)}
        >
          <Text
            style={[
              styles.pagamentoButtonText,
              formaPagamento === opcao && styles.pagamentoSelecionadoText,
            ]}
          >
            {opcao}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.payNowButton} onPress={realizarPagamento}>
        <Text style={styles.payNowButtonText}>Pagar Agora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  valor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a0ca3",
    marginTop: 10,
  },
  pagamentoButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pagamentoSelecionado: {
    backgroundColor: "#3a0ca3",
  },
  pagamentoButtonText: {
    textAlign: "center",
    color: "#333",
  },
  pagamentoSelecionadoText: {
    color: "#fff",
    fontWeight: "bold",
  },
  payNowButton: {
    marginTop: 30,
    backgroundColor: "#3a0ca3",
    padding: 14,
    borderRadius: 10,
  },
  payNowButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default Pagamento;