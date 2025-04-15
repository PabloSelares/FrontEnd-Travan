import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function Cart() {
  const router = useRouter();
  const { email, nome, id, idComprador, origem, destino, valorOriginal, desconto, valorDesconto } = useLocalSearchParams();
  const temViagem = origem && destino && valorOriginal && valorDesconto;

  if (!temViagem) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Carrinho de Compra</Text>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        </View>
      </View>
    );
  }

  const valorOriginalNumber = parseFloat(valorOriginal as string);
  const descontoNumber = parseFloat(desconto as string);
  const valorFinal = parseFloat(valorDesconto as string);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Carrinho de Compra</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Origem:</Text>
        <Text style={styles.value}>{origem}</Text>

        <Text style={styles.label}>Destino:</Text>
        <Text style={styles.value}>{destino}</Text>

        <Text style={styles.label}>Valor original:</Text>
        <Text style={styles.value}>R$ {valorOriginalNumber.toFixed(2)}</Text>

        <Text style={styles.label}>Desconto aplicado:</Text>
        <Text style={styles.value}>-{descontoNumber.toFixed(2)}%</Text>

        <Text style={styles.totalLabel}>Valor final:</Text>
        <Text style={styles.totalValue}>R$ {valorFinal}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/pagamento",
            params: {
              email,
              nome,
              idComprador: idComprador,
              id,
              origem,
              destino,
              valorFinal: valorFinal.toFixed(2),
            },
          })
        }
      >
        <Text style={styles.buttonText}>Finalizar Pagamento</Text>
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
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
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
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#000",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3a0ca3",
  },
  button: {
    backgroundColor: "#3a0ca3",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
  },
});
export default Cart;