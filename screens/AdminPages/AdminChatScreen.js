import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Text, Avatar } from "react-native-paper";
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

import { db, auth } from "../../firebaseconfig";

const AdminChatScreen = ({ route, navigation }) => {
  const { customerID, customerName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: customerName,
    });
    const q = query(
      collection(
        db,
        `chats/${customerID}_e1CRdb7FzJbA3GnCkEZo7LHWhH63/messages`
      ),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages.reverse());
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [customerID, customerName, navigation]);

  const sendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const chatId = `${customerID}_e1CRdb7FzJbA3GnCkEZo7LHWhH63`;
    const chatRef = doc(db, "chats", chatId);

    try {
      const messageData = {
        text: inputMessage,
        sender: "e1CRdb7FzJbA3GnCkEZo7LHWhH63",
        timestamp: new Date(),
      };

      await setDoc(
        chatRef,
        {
          participants: ["e1CRdb7FzJbA3GnCkEZo7LHWhH63", customerID],
          lastUpdated: new Date(),
          lastMessage: inputMessage,
          lastMessageSender: "e1CRdb7FzJbA3GnCkEZo7LHWhH63",
        },
        { merge: true }
      );
      await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === "e1CRdb7FzJbA3GnCkEZo7LHWhH63";
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginBottom: 10,
          justifyContent: isCurrentUser ? "flex-end" : "flex-start",
        }}
      >
        {!isCurrentUser && (
          <Avatar.Text
            size={30}
            label={customerName[0].toUpperCase()}
            style={{ marginRight: 8 }}
          />
        )}
        <View
          style={{
            backgroundColor: isCurrentUser ? "#DCF8C6" : "#E5E5EA",
            borderRadius: 20,
            padding: 10,
            maxWidth: "70%",
          }}
        >
          <Text>{item.text}</Text>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 200,
                height: 200,
                marginTop: 10,
                borderRadius: 10,
              }}
            />
          )}
        </View>
        {isCurrentUser && (
          <Avatar.Text size={30} label="You" style={{ marginLeft: 8 }} />
        )}
      </View>
    );
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          padding: 16,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#f0f0f0",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginRight: 10,
          }}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#ea1254",
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminChatScreen;
