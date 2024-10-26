import { View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { db, auth } from "../firebaseconfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function InquiryScreenPage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to upload images."
        );
      }
    })();
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendMessage = async () => {
    if (!message) {
      Alert.alert("Message required", "Please enter a message");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (image) {
        const storage = getStorage();
        const filename = image.split("/").pop();
        const storageRef = ref(storage, `inquiry_image/${filename}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Not logged in", "You must be logged in to send a message");
        return;
      }
      const uid = currentUser.uid;

      const chatId = `${uid}_e1CRdb7FzJbA3GnCkEZo7LHWhH63`; // Assuming admin is the recipient
      const chatRef = doc(db, "chats", chatId);

      const messageData = {
        text: message,
        imageUrl: imageUrl,
        sender: uid,
        timestamp: new Date(),
      };

      await setDoc(
        chatRef,
        {
          participants: [uid, "admin"],
          lastUpdated: new Date(),
          lastMessage: message,
          lastMessageSender: uid,
        },
        { merge: true }
      );

      await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
      navigation.navigate("ChatScreen", {
        adminID: "e1CRdb7FzJbA3GnCkEZo7LHWhH63",
        adminName: "Seller",
      });
    } catch (error) {
      Alert.alert("Error sending message", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 p-5  bg-gray-100 items-center">
      <ScrollView className="">
        <Image
          className="w-80 h-60 mb-4"
          source={require("../assets/Firefly redesign two person talking 76216.jpg")}
        />

        <Text className="text-xl font-bold mb-4">
          Do you have special requests?
        </Text>
        <TextInput
          className="mb-2.5 py-3"
          mode="outlined"
          multiline
          numberOfLines={2}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={pickImage} className="mb-4 items-center">
          {image ? (
            <Image source={{ uri: image }} className="w-full h-52 rounded-lg" />
          ) : (
            <View className="border-2 border-gray-300 border-dashed rounded-lg w-52 h-52 justify-center items-center">
              <Image
                source={require("../assets/gallery.png")}
                className="w-24 h-24"
              />
              <Text className="text-gray-500 text-lg">Attached Image</Text>
            </View>
          )}
        </TouchableOpacity>
        <Button
          onPress={sendMessage}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="bg-[#f13a72] rounded-md items-center mt-2"
          textColor="white"
        >
          Send
        </Button>
      </ScrollView>
    </View>
  );
}
