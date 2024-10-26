import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Text, Avatar, Divider } from "react-native-paper";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebaseconfig";

const AdminMessageScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = useCallback(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", "e1CRdb7FzJbA3GnCkEZo7LHWhH63"),
      orderBy("lastUpdated", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const chatData = [];
        const userDataPromises = querySnapshot.docs.map(async (doc) => {
          const chat = { id: doc.id, ...doc.data() };
          const otherParticipantId = chat.participants.find(
            (id) => id !== "e1CRdb7FzJbA3GnCkEZo7LHWhH63"
          );
          const userDoc = await getDocs(
            query(
              collection(db, "users"),
              where("UID", "==", otherParticipantId)
            )
          );
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            chat.otherParticipantName = userData.name || "Unknown User";
          } else {
            chat.otherParticipantName = "Unknown User";
          }
          return chat;
        });

        const resolvedChatData = await Promise.all(userDataPromises);
        setChats(resolvedChatData);
        setRefreshing(false);
      },
      (error) => {
        console.error("Error in onSnapshot:", error);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("useEffect triggered");
    const unsubscribe = fetchChats();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchChats]);

  const onRefresh = useCallback(() => {
    console.log("onRefresh triggered");
    setRefreshing(true);
    fetchChats();
  }, [fetchChats]);

  const renderChatItem = ({ item }) => {
    console.log("Rendering chat item:", item);
    const otherParticipantId = item.participants.find((id) => id !== "admin");
    const isLastMessageFromCurrentUser = item.lastMessageSender === "admin";

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate("AdminChatScreen", {
            customerID: otherParticipantId,
            customerName: item.otherParticipantName,
          })
        }
      >
        <Avatar.Text
          size={50}
          label={item.otherParticipantName[0].toUpperCase()}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.otherParticipantName}</Text>
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessageSender}>
              {isLastMessageFromCurrentUser
                ? "You: "
                : `${item.otherParticipantName}: `}
            </Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {item.lastMessage || "No messages yet"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  chatInfo: {
    marginLeft: 16,
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessageSender: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
});

export default AdminMessageScreen;
