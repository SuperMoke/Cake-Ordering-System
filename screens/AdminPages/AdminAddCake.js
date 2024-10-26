import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function AddCakeScreen({ navigation }) {
  const [cakename, setCakeName] = useState("");
  const [cakedescription, setCakeDescription] = useState("");
  const [cakeprice, setCakePrice] = useState("");
  const [cakecaloriecount, setCakeCalorieCount] = useState("");
  const [cakeimage, setCakeImage] = useState(null);

  const pickImage = async () => {
    // Request permission to access camera roll
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "You've refused to allow this app to access your photos!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setCakeImage(result.assets[0].uri);
    }
  };

  const handleAddCake = async () => {
    if (
      !cakename ||
      !cakedescription ||
      !cakeprice ||
      !cakecaloriecount ||
      !cakeimage
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "cakes"), {
        cakename,
        cakedescription,
        cakeprice,
        cakecaloriecount,
        cakeimage,
      });
      Alert.alert("Success", "New cake added successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding cake:", error);
      Alert.alert("Error", "Something went wrong while adding the cake.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 15, alignItems: "stretch" }}>
      <TouchableOpacity
        className="absolute top-10 left-2.5 p-2.5  rounded-full z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#f13a72" />
      </TouchableOpacity>
      <View className="flex justify-center mt-28">
        <Text className="text-2xl font-bold text-center mb-2">
          Add New Cake
        </Text>
        <TouchableOpacity onPress={pickImage} className="mb-4 items-center">
          {cakeimage ? (
            <Image
              source={{ uri: cakeimage }}
              className="w-full h-52 rounded-lg"
            />
          ) : (
            <View className="border-2 border-gray-300 border-dashed rounded-lg w-52 h-52 justify-center items-center">
              <Text className="text-gray-500 text-lg">Upload Cake Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Cake Name"
          value={cakename}
          onChangeText={setCakeName}
          className="bg-white mb-2.5 px-3.5 py-2.5 rounded border border-gray-300"
        />
        <TextInput
          placeholder="Cake Description"
          value={cakedescription}
          onChangeText={setCakeDescription}
          className="bg-white mb-2.5 px-3.5 py-2.5 rounded border border-gray-300"
          multiline
        />
        <TextInput
          placeholder="Cake Price"
          value={cakeprice}
          onChangeText={setCakePrice}
          className="bg-white mb-2.5 px-3.5 py-2.5 rounded border border-gray-300"
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Calorie Count"
          value={cakecaloriecount}
          onChangeText={setCakeCalorieCount}
          className="bg-white mb-2.5 px-3.5 py-2.5 rounded border border-gray-300"
          keyboardType="numeric"
        />

        <Button
          mode="contained"
          onPress={handleAddCake}
          className="my-2.5 bg-[#f13a72]"
        >
          Add Cake
        </Button>
      </View>
    </ScrollView>
  );
}
