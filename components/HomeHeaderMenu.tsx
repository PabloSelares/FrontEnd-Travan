import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Divider, Menu } from 'react-native-paper';

function HomeHeaderMenu(userInfo: any) {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Menu
      visible={show}
      onDismiss={() => setShow(false)}
      anchor={
        <TouchableOpacity onPress={() => setShow(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={28} color="white" />
        </TouchableOpacity>
      }
      contentStyle={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 4,
        elevation: 4,
        minWidth: 180,
      }}
      style={{
        marginTop: 40,
      }}
    >
      <Menu.Item
        title="Perfil"
        onPress={() => {}}
        titleStyle={{ fontSize: 16, color: '#333' }}
        leadingIcon="account"
      />
      <Menu.Item
        title="Configurações"
        onPress={() => {}}
        titleStyle={{ fontSize: 16, color: '#000' }}
        leadingIcon="cog-outline"
      />
      <Menu.Item
        onPress={() => {
          router.replace('/services/ChangeName');
        }}
        title="Conversar com a IA"
        titleStyle={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}
        leadingIcon="robot-outline"
      />
      <Divider />
      <Menu.Item
        title="Sair"
        onPress={() => router.replace('/login')}
        titleStyle={{ fontSize: 16, color: '#000' }}
        leadingIcon="logout"
      />
    </Menu>
  );
}

export default HomeHeaderMenu;
