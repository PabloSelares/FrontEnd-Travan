import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function landpage() {
    const { email } = useLocalSearchParams();
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seja Bem-vindo!</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: "/(tabs)/home", params: { email: email } })}>
                <Text style={styles.buttonText}>Veja todas as viagens</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
        backgroundColor: "#F0F4F8",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    }, button: {
        backgroundColor: "#3a0ca3",
        padding: 20,
        borderRadius: 8,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
      },

})

export default landpage