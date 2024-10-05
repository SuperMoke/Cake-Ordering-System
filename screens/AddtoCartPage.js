import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function AddtoCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        fetchUserInfo(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartCollection = collection(db, "cart");
        const q = query(
          cartCollection,
          where("userInfo.email", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const fetchedCartItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (userEmail) {
      fetchCartItems();
    }
  }, [userEmail]);

  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      const formatDateTime = () => {
        const now = new Date();
        const date = now.toLocaleDateString("en-US"); // Format date as MM/DD/YYYY
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strMinutes = minutes < 10 ? "0" + minutes : minutes;
        const time = hours + ":" + strMinutes + " " + ampm;
        return `${date} ${time}`;
      };

      const currentDateTime = formatDateTime();

      // Add cart items to orders collection
      const ordersCollection = collection(db, "orders");
      for (const item of cartItems) {
        const { id, ...orderData } = item; // Exclude the id field
        await addDoc(ordersCollection, {
          ...orderData,
          userInfo,
          status: "Pending",
          orderDateTime: currentDateTime,
        });
      }

      // Clear cart items
      const cartItemIds = cartItems.map((item) => item.id);
      for (const itemId of cartItemIds) {
        await deleteDoc(doc(db, "cart", itemId));
      }

      setCartItems([]);
      alert("Checkout successful!");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const renderCartItem = ({ item }) => {
    return (
      <View className="bg-white rounded-xl mb-5 shadow-lg ">
        <View className="flex flex-row">
          <Image
            source={{ uri: item.cakeImage }}
            className="w-32"
            resizeMode="contain"
          />
          <View className="p-4">
            <View className="flex flex-row ">
              <Text className="text-base font-bold mb-1 text-gray-700">
                {item.cakeName}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                className="ml-14"
              >
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
            <Text className="text-base font-semibold text-[#fb78a0] mb-2">
              ₱{item.cakePrice}
            </Text>

            <Text className="text-base text-gray-600 mb-1">
              {item.cakeSize}
            </Text>
            <View className="flex flex-row">
              <Image
                source={require("../assets/calories.png")}
                style={{ width: 18, height: 18 }}
              />
              <Text className="text-base text-gray-600">
                {item.cakeCalories} calories
              </Text>
            </View>
          </View>
        </View>
        <View className="mx-4 my-4">
          <Text className="text-base text-gray-600 mb-1">
            Filling: {item.cakeFilling}
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Frosting: {item.cakeFrosting}
          </Text>
          <Text className="text-base text-gray-600 mb-1">
            Sugar Content: {item.cakeSugar}
          </Text>
          <Text className="text-base text-gray-600 italic mt-1">
            Special Instructions: {item.SpecialInstruction}
          </Text>
        </View>
      </View>
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.cakePrice),
      0
    );
  };

  const totalPrice = calculateTotalPrice();

  return (
    <SafeAreaView className="flex-1 bg-[#fb78a0]">
      <TouchableOpacity
        className="absolute top-10 left-2.5 p-2.5 rounded-full z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-1 mt-20">
        <ScrollView className="flex-1 bg-gray-100 rounded-t-[30px] px-5 pt-5">
          {cartItems.length === 0 ? (
            <Text>Your cart is empty</Text>
          ) : (
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </ScrollView>
        <View className="bg-gray-100 py-2  shadow-lg flex-col">
          <View className="flex-col justify-between items-center mx-4 mt-2">
            <Text className="text-base ">Total Price</Text>
            <Text className="text-lg font-bold text-[#f13a72]">
              ₱{totalPrice.toFixed(2)}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleCheckout}
            className="rounded-full  bg-[#f13a72] mx-4 my-2 "
            labelStyle="text-lg font-bold"
          >
            Checkout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
