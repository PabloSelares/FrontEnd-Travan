import { Tabs, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PaperProvider } from "react-native-paper";
import HomeHeaderMenu from "@/components/HomeHeaderMenu";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import httpService from "../services/httpService";


export default function TabLayout() {
  const params = useLocalSearchParams();
  const { email } = params;
  const [nome, setNome] = useState<string>();
  useEffect(() => {
    const buscarUsarioLogado = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn("Token não encontrado. Usuário precisa logar.");
          return;
        }
        const response = await httpService.get(`http://10.5.2.247:3000/api/ser/findByEmail/${email}}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000
        });

        if (response.status == 200) {
          setNome(response.data.name);
        } else {
          console.warn("Erro na resposta:", response.status);
        }

      } catch (e) { }
    }
    buscarUsarioLogado();
  }, [email]);
  
  const userLogged = {
    name: nome,
    email: email
  };
  return (
    <PaperProvider>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerTitleStyle: {
              color: "#fff",
              fontWeight: "bold",
              fontSize: 24,
            },
            headerStyle: {
              backgroundColor: "#3a0ca3",
            },
            headerTitle: "Travan",
            headerRight: () => {
              return <HomeHeaderMenu userInfo={userLogged} />;
            },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
            tabBarInactiveTintColor: "#3a0ca3",
            tabBarActiveTintColor: "#1BD7BF",
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Carrinho",
            headerTitleStyle: {
              color: "#fff",
              fontWeight: "bold",
              fontSize: 24,
            },
            headerStyle: {
              backgroundColor: "#3a0ca3",
            },
            headerTitle: "Carrinho",
            headerRight: () => {
              return <HomeHeaderMenu userInfo={userLogged} />;
            },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
            tabBarInactiveTintColor: "#3a0ca3",
            tabBarActiveTintColor: "#1BD7BF",
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
