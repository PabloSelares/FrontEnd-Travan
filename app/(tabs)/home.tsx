import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import httpService from "../services/httpService";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 30;
const [viagens,setViagens]=useState<Viagem[]>([]);


type Viagem = {
  id: string;
  origem: string;
  destino: string;
  preco: number;
  desconto?: number;
};

interface ViagensDisponiveis {
  viagens: Viagem;
}

const TripCard: React.FC<ViagensDisponiveis> = ({viagens}) => {
  const router = useRouter();
  const valorOriginal = viagens.preco;
  const valorPromocional = viagens.desconto ? (viagens.desconto) : null;
  

  return (
    <View style={styles.card}>
    

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: "/(tabs)/cart",
            params: {
              origem: viagens.origem,
              destino: viagens.destino,
              valorOriginal: viagens.preco,
              valorDesconto: valorPromocional?.toString() || viagens.preco.toString(),
            },
          });
        }}
      >
        <Text style={styles.buttonText}>Agendar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
};

function Home() {
  
  useEffect(() => {
    const buscarDadosProtegidos = async () => {
      try {
     
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.warn("Token não encontrado. Usuário precisa logar.");
          return;
        }

        // Faz a requisição com o token no header Authorization
        const data = await httpService.get('http://10.0.0.25:3000/api/viagens', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.ok) {
          const response = await data.json();
          setViagens(response);
        } else {
          console.warn("Erro na resposta:", data.status);
        }
      } catch (error) {
        console.error("Erro ao buscar dados protegidos:", error);
      }
    };

    buscarDadosProtegidos();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌍 Viagens Disponíveis</Text>
      <View style={styles.cardContainer}>
        {viagens.map((viagem) => (
          <TripCard key={viagem.id} viagens={viagem} />
        ))}
      </View>
    </ScrollView>
  );
}

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    width: cardWidth,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
    color: "#444",
  },
  valorTexto: {
    marginBottom: 10,
    alignItems: "center",
  },
  valorOriginal: {
    textDecorationLine: "line-through",
    color: "red",
    fontSize: 12,
  },
  valorFinal: {
    textAlign: "center",
    fontSize: 15,
    color: "#3a0ca3",
    fontWeight: "600",
  },
  valorSemDesconto: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3a0ca3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Home;