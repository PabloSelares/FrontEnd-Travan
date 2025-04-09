import React, { Fragment, useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

class Message {
  text: string;
  sentBy: string;
  timestamp: Date;

  constructor(text: string, sentBy: string) {
    this.text = text;
    this.sentBy = sentBy;
    this.timestamp = new Date();
  }
}

interface BalloonProps {
  message: Message;
  userLogged: string;
}

const Colors = {
  primary: "#3a0ca3",
  secondary: "#f0f0f0",
  white: "#ffffff",
  black: "#000000",
  light: "#e0e0e0",
};

const Chat = () => {
  const params = useLocalSearchParams();
  const scrollRef = useRef<FlatList<Message>>(null);
  const [userLogged] = useState(params.username as string);
  const [chat, setChat] = useState<{ messages: Message[] }>({ messages: [] });
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://10.5.5.197:3000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket conectado com sucesso.");
    };

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setChat((prevChat) => ({
          messages: [...prevChat.messages, json],
        }));
        scrollRef.current?.scrollToEnd({ animated: true });
      } catch (error: any) {
        console.error("Erro ao processar mensagem:", error.message);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    try {
      const newMessage = new Message(message, userLogged);
      setChat((prevChat) => ({
        messages: [...prevChat.messages, newMessage],
      }));

      wsRef.current?.send(JSON.stringify(newMessage));
      setMessage("");
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error.message);
    }
  };

  return (
    <Fragment>
      <FlatList
        ref={scrollRef}
        data={chat.messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Balloon message={item} userLogged={userLogged} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ alignSelf: "center", color: "#848484" }}>
            Sem mensagens no momento
          </Text>
        )}
      />

      <SafeAreaView>
        <View style={styles.messageTextInputContainer}>
          <TextInput
            style={styles.messageTextInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="rgba(58, 12, 163, 0.5)"
            value={message}
            multiline
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            disabled={!message.trim()}
            onPress={sendMessage}
          >
            <Ionicons
              name="send"
              color={message.trim() === "" ? Colors.light : Colors.primary}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const Balloon = ({ message, userLogged }: BalloonProps) => {
  const isSent = userLogged === message.sentBy;

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isSent ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived,
      ]}
    >
      <View
        style={[
          styles.balloon,
          isSent ? styles.balloonSent : styles.balloonReceived,
        ]}
      >
        {!isSent && <Text style={styles.senderName}>{message.sentBy}</Text>}
        <Text
          style={isSent ? styles.balloonTextSent : styles.balloonTextReceived}
        >
          {message.text}
        </Text>
        <Text style={styles.timestamp}>
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Hora indisponível"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyMessage: {
    alignSelf: "center",
    color: "#848484",
    marginTop: 20,
  },
  bubbleWrapper: {
    marginVertical: 4,
    maxWidth: "80%",
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  balloonReceived: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: "bold",
    marginBottom: 4,
    color: "#3a0ca3",
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    color: "rgb(255, 255, 255)",
    textAlign: "right",
    marginTop: 4,
  },
  messageTextInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
  },
  messageTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.light,
    borderWidth: 1,
    fontSize: 16,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
});

export default Chat;
