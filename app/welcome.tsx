import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Welcome = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1a002a", "#3a0ca3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <FontAwesome5 name="road" size={100} style={styles.icon} />
          <Text style={styles.title}>TraVan</Text>
          <Text style={styles.subtitle}>Para onde iremos hoje?</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.replace('/register')}
          >
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "88%",
    height: "65%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  titleContainer: {
    alignItems: "center",
    gap: 10,
  },
  icon: {
    color: "#3a0ca3",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3a0ca3",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#3a0ca3",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a0ca3",
  },
  registerButtonText: {
    color: "#3a0ca3",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    width: "100%",
    alignItems: "center",
    gap: 20
  },
});
export default Welcome;