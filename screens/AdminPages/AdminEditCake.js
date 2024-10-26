import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function EditCakeScreen({ route, navigation }) {
  const { cake } = route.params;

  const [cakename, setCakeName] = useState(cake.cakename);
  const [cakedescription, setCakeDescription] = useState(cake.cakedescription);
  const [cakeprice, setCakePrice] = useState(cake.cakeprice.toString());
  const [cakecaloriecount, setCakeCalorieCount] = useState(
    cake.cakecaloriecount.toString()
  );
  const [cakeimage, setCakeImage] = useState(cake.cakeimage);

  useEffect(() => {
    navigation.setOptions({
      title: `Edit ${cake.cakename}`,
    });
  }, [cake.cakename, navigation]);

  const pickImage = async () => {
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

  const handleUpdateCake = async () => {
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
      await updateDoc(doc(db, "cakes", cake.id), {
        cakename,
        cakedescription,
        cakeprice,
        cakecaloriecount,
        cakeimage,
      });
      Alert.alert("Success", "Cake updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating cake:", error);
      Alert.alert("Error", "Something went wrong while updating the cake.");
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
        <Text className="text-2xl font-bold text-center mb-2">Edit Cake</Text>
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
          onPress={handleUpdateCake}
          className="my-2.5 bg-[#f13a72]"
        >
          Update Cake
        </Button>
      </View>
    </ScrollView>
  );
}
