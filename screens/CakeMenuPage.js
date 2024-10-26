import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Text, RadioButton, Button, TextInput } from "react-native-paper";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebaseconfig";
import Slider from "@react-native-community/slider";

const CakeMenuPage = ({ route }) => {
  const { cake } = route.params;
  const [size, setSize] = useState("Small (6 Inch)");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [totalPrice, setTotalPrice] = useState(cake.cakeprice);
  const navigation = useNavigation();
  const [sugarContent, setSugarContent] = useState(50);

  const sugarLevels = [
    { value: 0, label: "Sugar Free" },
    { value: 25, label: "Low Sugar" },
    { value: 50, label: "Regular" },
    { value: 75, label: "High Sugar" },
    { value: 100, label: "Extra Sweet" },
  ];

  const fetchUserInfo = async (email) => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserInfo(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    let price = Number(cake.cakeprice);
    if (size === "Medium (8 Inch)") {
      price += 300;
    } else if (size === "Large (10 Inch)") {
      price += 600;
    }
    setTotalPrice(price);
  }, [size, cake.cakeprice]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.email);
      } else {
        navigation.navigate("LoginScreenPage");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        cakeImage: cake.cakeimage,
        cakeName: cake.cakename,
        cakePrice: totalPrice,
        cakeSize: size,
        cakeSugar: sugarContent,
        cakeCalories: cake.cakecaloriecount,
        specialInstruction: specialInstructions,
        userInfo: userInfo,
      };
      await addDoc(collection(db, "cart"), cartItem);
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Image
        source={{ uri: cake.cakeimage }}
        className="absolute top-0 left-0 w-full h-2/5"
        resizeMode="cover"
      />
      <TouchableOpacity
        className="absolute top-10 left-2.5 p-2.5  rounded-full z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#f13a72" />
      </TouchableOpacity>

      <View className="flex-1 mt-72">
        <ScrollView className="flex-1 bg-white rounded-t-[30px] px-5 pt-5">
          <View className="flex flex-row justify-between mb-2">
            <Text className="text-2xl font-bold ">{cake.cakename}</Text>
            <View className="flex flex-row">
              <Image
                source={require("../assets/calories.png")}
                style={{ width: 18, height: 18 }}
              />
              <Text className="text-base">
                {cake.cakecaloriecount} calories
              </Text>
            </View>
          </View>
          <Text className="text-base text-gray-600 mb-5">
            {cake.cakedescription}
          </Text>
          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Size</Text>
            <RadioButton.Group onValueChange={setSize} value={size}>
              {["Small (6 Inch)", "Medium (8 Inch)", "Large (10 Inch)"].map(
                (option) => (
                  <View key={option} className="flex-row items-center mb-2">
                    <RadioButton value={option} color="#f13a72" />
                    <Text className="text-base ml-2">
                      {option}{" "}
                      {option !== "Small (6 Inch)" &&
                        `+${option === "Medium (8 Inch)" ? "300" : "600"}`}
                    </Text>
                  </View>
                )
              )}
            </RadioButton.Group>
          </View>
          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Sugar Content</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={25}
              value={sugarContent}
              onValueChange={setSugarContent}
              minimumTrackTintColor="#f13a72"
              maximumTrackTintColor="#fb78a0"
              thumbTintColor="#DB6551"
            />
            <View className="flex-row justify-between mt-2">
              {sugarLevels.map((level) => (
                <Text key={level.value} className="text-xs text-center">
                  {level.label}
                </Text>
              ))}
            </View>
            <Text className="text-base text-center mt-2 font-bold">
              {sugarContent} grams -{" "}
              {sugarLevels.find((level) => level.value === sugarContent)?.label}
            </Text>
          </View>
          <TextInput
            mode="outlined"
            label="Special Instructions"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            className="bg-gray-100 mb-5"
            multiline
          />
        </ScrollView>
      </View>
      <View className="bg-gray-100 py-2 rounded-t-[30px] shadow-lg flex-row">
        <View className="flex-col justify-between items-center mx-4 mt-2">
          <Text className="text-base ">Total Price</Text>
          <Text className="text-lg font-bold text-[#f13a72]">
            ₱{totalPrice}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          className="rounded-full  bg-[#f13a72] px-16 my-2 "
          labelStyle="text-lg font-bold"
        >
          Add to Cart
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CakeMenuPage;
