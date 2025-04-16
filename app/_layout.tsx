import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router"; 
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TouchableOpacity, Text } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"), 
  });

  const router = useRouter(); 

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cart" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="pagamento" options={{ headerShown: false }} />
      <Stack.Screen name="landpage" options={{ headerShown: false }} />
      
      <Stack.Screen 
        name="changeName" 
        options={{ 
          headerTitleAlign: "center",
          title: 'Alterar Nome',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
            onPress={() => router.back()}
              style={{ padding: 10, marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />

      <Stack.Screen
        name="chat"
        options={{
          headerTitleAlign: "center",
          title: 'AI Chat Travan',
          
          headerTitleStyle: {
            color: "#fff",
            fontWeight: "bold",
          },

          //mudar a cor do background
          headerStyle: {
            backgroundColor: "#3a0ca3",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 10, marginLeft: 15,  }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="carrinho" options={{ headerShown: false }} />
    </Stack>
  );
}