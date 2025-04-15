import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import httpService from "../services/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 30;


type Viagem = {
  _id: string;
  origem: string;
  destino: string;
  preco: number;
  desconto?: number;
};

interface ViagensDisponiveis {
  viagens: Viagem;
  email: string;
  nome?: string;
  idComprador?: string;
}

const TripCard: React.FC<ViagensDisponiveis> = ({ viagens, email, nome, idComprador }) => {
  const router = useRouter();


  const valorOriginal = viagens.preco;
  const desconto = viagens.desconto || 0;
  const valorComDesconto = valorOriginal - (valorOriginal * (desconto / 100));
  const temDesconto = desconto > 0;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: "https://source.unsplash.com/featured/?travel" }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.routeText}>
        {viagens.origem} → {viagens.destino}
      </Text>
      <View style={styles.valorTexto}>
        {temDesconto ? (
          <>
            <Text style={styles.valorOriginal}>{formatarValor(valorOriginal)}</Text>
            <Text style={styles.valorFinal}>{formatarValor(valorComDesconto)}</Text>
          </>
        ) : (
          <Text style={styles.valorSemDesconto}>{formatarValor(valorOriginal)}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: "/(tabs)/cart",
            params: {
              email: email,
              nome: nome,
              idComprador: idComprador,
              id: viagens._id,
              origem: viagens.origem,
              destino: viagens.destino,
              valorOriginal: valorOriginal.toString(),
              desconto: desconto.toString(),
              valorDesconto: temDesconto
                ? valorComDesconto.toString()
                : valorOriginal,
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
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const { email: rawEmail } = useLocalSearchParams();
  const email = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
  const [nome, setNome] = useState<string>();
  const [idComprador, setIdComprador] = useState<string>();
  useEffect(() => {
    const buscarUsarioLogado = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn("Token não encontrado. Usuário precisa logar.");
          return;
        }
        const response = await httpService.get(`http://192.168.15.105:3000/api/user/findByEmail/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000
        });

        if (response.status == 200) {
          setNome(response.data.name);
          setIdComprador(response.data._id);
        } else {
          throw new Error("Erro ao buscar usuário logado.");
        }

      } catch (e) { 
        console.error("Erro ao buscar usuário logado:", e);
        Alert.alert("Erro ao buscar usuário logado. Tente novamente mais tarde.");
      }
    }
    buscarUsarioLogado();
  }, [email]);
  useEffect(() => {
    const buscarDadosProtegidos = async () => {
      try {

        const token = await AsyncStorage.getItem('token');

        if (!token) {
          console.warn("Token não encontrado. Usuário precisa logar.");
          return;
        }

        // Faz a requisição com o token no header Authorization
        const response = await httpService.get('http://192.168.15.105:3000/api/viagens', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000
        });

        if (response.status == 200) {
          setViagens(response.data);
        } else {
          console.warn("Erro na resposta:", response.status);
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
        {nome && idComprador ? (
          viagens.map((viagem) => (
            <TripCard
              key={viagem._id}
              viagens={viagem}
              email={email}
              nome={nome}
              idComprador={idComprador}
            />
          ))
        ) : (
          <Text>Carregando usuário...</Text>
        )}
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