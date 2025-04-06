import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Cart() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);

  const valorOriginal = Number(params.valorOriginal) || 0;
  const valorDesconto = Number(params.valorDesconto) || 0;
  const valorFinal = valorOriginal - valorDesconto;

  const limparCompra = () => {
    AsyncStorage.removeItem("dadosCompra");
    setPagamentoConcluido(false);
    router.replace("/cart");
  };

  const confirmarViagem = () => {
    if (!params.origem || !params.destino || valorOriginal <= 0 || valorFinal <= 0) {
      alert("Adicione um item ao carrinho.");
      return;
    }

    AsyncStorage.removeItem("dadosCompra");
    setPagamentoConcluido(true);
  };

  const novaViagem = () => {
    setPagamentoConcluido(false);
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      {pagamentoConcluido ? (
        <>
          <Text style={styles.pagamentoTexto}>Pagamento concluído</Text>
          <TouchableOpacity style={styles.button} onPress={novaViagem}>
            <Text style={styles.buttonText}>Nova Viagem</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.viagemContainer}>
            <Text style={styles.viagemText}>Origem: {params.origem}</Text>
            <Text style={styles.viagemText}>Destino: {params.destino}</Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Valor Original: R${valorOriginal.toFixed(2)}</Text>
            <Text style={styles.textAviso}>Você ganhou um desconto de R${valorDesconto.toFixed(2)}</Text>
            <Text style={styles.totalText}>Valor a Pagar: R${valorFinal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={confirmarViagem}>
            <Text style={styles.buttonText}>Confirmar Viagem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={limparCompra}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: "5%",
  },
  viagemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "flex-start",
    width: "90%",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  viagemText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  totalContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: "90%",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    
  },
  textAviso: {
    fontSize: 13,
    color: "green",
  },
  button: {
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
  removeButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pagamentoTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Cart;
