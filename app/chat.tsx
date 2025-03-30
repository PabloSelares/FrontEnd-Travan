import React, { Fragment, useState } from "react";
import { FlatList, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";


type Message = {
  text: string;
  sentBy: string;
  timestamp?: Date;
};

type BalloonProps = {
  message: Message;
  userLogged: string;
};

const Colors = {
  primary: '#3a0ca3',
  secondary: '#f0f0f0',
  white: '#ffffff',
  black: '#000000',
  light: '#e0e0e0',
};

const Chat = () => {
  const [userLogged, setUserLogged] = useState("usuário1"); 
  const [chat, setChat] = useState<{ messages: Message[] }>({ messages: [] });
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message.trim() === "") return; 
    
    const newMessage: Message = {
      text: message,
      sentBy: userLogged,
      timestamp: new Date()
    };
    
    setChat(prev => ({
      messages: [...prev.messages, newMessage]
    }));
    setMessage("");
  };

  return (
    <Fragment>
      <FlatList
        data={chat.messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Balloon message={item} userLogged={userLogged} />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>Nenhuma mensagem encontrada</Text>
        )}
       
      />

      <View style={styles.messageInputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.messageInput}
          placeholderTextColor="#848484"
          placeholder="Escreva uma mensagem"
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={styles.sendButton}
          disabled={message.trim() === ""}
        >
          <Ionicons 
            name="send" 
            color={message.trim() === "" ? Colors.light : Colors.primary} 
            size={24} 
          />
        </TouchableOpacity>
      </View>
    </Fragment>
  );
};

const Balloon = ({ message, userLogged }: BalloonProps) => {
  const isSent = message.sentBy === userLogged;
  
  return (
    <View style={[
      styles.bubbleWrapper, 
      isSent ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived
    ]}>
      <View style={[
        styles.balloon, 
        isSent ? styles.balloonSent : styles.balloonReceived
      ]}>
        {!isSent && <Text style={styles.senderName}>{message.sentBy}</Text>}
        <Text style={isSent ? styles.balloonTextSent : styles.balloonTextReceived}>
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  emptyMessage: {
    alignSelf: "center", 
    color: "#848484",
    marginTop: 20
  },
  bubbleWrapper: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  bubbleWrapperSent: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  bubbleWrapperReceived: {
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  balloon: {
    padding: 12,
    borderRadius: 16,
  },
  balloonSent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  balloonReceived: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 2,
  },
  balloonTextSent: {
    color: Colors.white,
    fontSize: 16,
  },
  balloonTextReceived: {
    color: Colors.black,
    fontSize: 16,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.black,
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'right',
    marginTop: 4,
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.light,
    borderWidth: 1,
    fontSize: 16,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
  },
  scrollViewContainer: {
    padding: 12,
    paddingBottom: 0,
  },
  sendButton: {
    padding: 8,
  },
});

export default Chat;