import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 30;

type Viagens = {
  id: number;
  origem: string;
  destino: string;
  image: string;
  valor: string;
  valorPromocional?: string;
};

interface ViagensDisponiveis {
  viagens: Viagens;
}

const TripCard: React.FC<ViagensDisponiveis> = ({ viagens }) => {
  const router = useRouter();

  const valorOriginal = parseFloat(viagens.valor);
  const valorPromocional = viagens.valorPromocional
    ? parseFloat(viagens.valorPromocional)
    : null;

  const valorFinal = valorPromocional ? valorOriginal - valorPromocional : null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: viagens.image }} style={styles.image} />
      <Text style={styles.routeText}>
        {viagens.origem} ➜ {viagens.destino}
      </Text>

      {valorPromocional ? (
        <View style={styles.valorTexto}>
          <Text style={styles.valorOriginal}>De: R$ {formatarValor(valorOriginal)}</Text>
          <Text style={styles.valorFinal}>  Por apenas:     R$ {formatarValor(valorFinal!)}</Text>
        </View>
      ) : (
        <Text style={styles.valorSemDesconto}>R$ {formatarValor(valorOriginal)}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: "/(tabs)/cart",
            params: {
              origem: viagens.origem,
              destino: viagens.destino,
              valorOriginal: viagens.valor,
              valorDesconto: valorPromocional?.toString() || viagens.valor,
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
  const viagens = [
    {
      id: 1,
      origem: "São Paulo",
      destino: "Rio de Janeiro",
      image:
        "https://www.viajanet.com.br/blog/wp-content/uploads/2018/08/foto-que-fica-embaixo-da-linha-fina.jpg",
      valor: "150.00",
      valorPromocional: "50.00",
    },
    {
      id: 2,
      origem: "Lagoa Seca",
      destino: "Campina Grande",
      image:
        "https://www.vaipradisney.com/blog/wp-content/uploads/2018/10/CRUZEIRO-DISNEY-ATLANTIS-NADO-GOLFINHO-BAHAMAS13.jpg",
      valor: "936.53",
      valorPromocional: "200.00",
    },
    {
      id: 3,
      origem: "Nova Iorque",
      destino: "Boston",
      image:
        "https://www.vaipradisney.com/blog/wp-content/uploads/2018/10/CRUZEIRO-DISNEY-ATLANTIS-NADO-GOLFINHO-BAHAMAS13.jpg",
      valor: "115.00",
      valorPromocional: "50.00",
    },
    {
      id: 4,
      origem: "São Paulo",
      destino: "Rio de Janeiro",
      image:
        "https://www.viajanet.com.br/blog/wp-content/uploads/2018/08/foto-que-fica-embaixo-da-linha-fina.jpg",
      valor: "150.00",
      valorPromocional: "50.00",
    },
  ];

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
