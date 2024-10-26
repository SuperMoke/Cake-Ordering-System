import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Card, ProgressBar, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    let unsubscribe;

    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const q = query(
          ordersCollection,
          where("userInfo.email", "==", userEmail)
        );

        // Use onSnapshot to listen for real-time updates
        unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedOrders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(fetchedOrders);
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (userEmail) {
      fetchOrders();
    }

    // Cleanup the listener on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userEmail]);

  const getOrderStatus = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Making the Cake":
        return 0.33;
      case "Delivering the Cake":
        return 0.66;
      case "Finished":
        return 1;
      default:
        return 0;
    }
  };

  const renderOrderItem = ({ item }) => {
    // Determine the order type based on the cakeName
    const orderType =
      item.cakeName === "Customized Cake"
        ? "Customized Cake"
        : "Signature Cake";

    return (
      <View className="bg-white rounded-xl mb-5 shadow-lg">
        <View className="flex flex-row">
          {/* Display a default image if cakeImage is not available */}
          <Image
            source={{ uri: item.cakeImage }}
            className="w-32"
            resizeMode="contain"
          />
          <View className="p-4">
            <View className="flex flex-row">
              <Text className="text-base font-bold mb-1 text-gray-700">
                {item.cakeName}
              </Text>
            </View>
            <Text className="text-sm text-gray-500 mb-1">{orderType}</Text>
            <Text className="text-base font-semibold text-[#fb78a0] mb-2">
              ₱{item.cakePrice}
            </Text>
            {item.cakeSize && (
              <Text className="text-base text-gray-600 mb-1">
                Size: {item.cakeSize}
              </Text>
            )}
            {item.cakeCalories && (
              <View className="flex flex-row">
                <Image
                  source={require("../assets/calories.png")}
                  style={{ width: 18, height: 18 }}
                />
                <Text className="text-base text-gray-600">
                  {item.cakeCalories} calories
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="mx-4 my-4">
          {/* Display additional details for customized cakes */}
          {orderType === "Customized Cake" && (
            <>
              {item.cakeToppings && (
                <Text className="text-base text-gray-600 mb-1">
                  Toppings: {item.cakeToppings}
                </Text>
              )}
              {item.cakeIcingColor && (
                <Text className="text-base text-gray-600 mb-1">
                  Icing Color: {item.cakeIcingColor}
                </Text>
              )}
              {item.cakeFilling && (
                <Text className="text-base text-gray-600 mb-1">
                  Filling: {item.cakeFilling}
                </Text>
              )}
              {item.cakeSugarLevel !== undefined && (
                <Text className="text-base text-gray-600 mb-1">
                  Sugar Level: {item.cakeSugarLevel}%
                </Text>
              )}
              {item.isGlutenFree && (
                <Text className="text-base text-gray-600 mb-1">
                  Gluten Free: Yes
                </Text>
              )}
              {item.addOns && (
                <Text className="text-base text-gray-600 mb-1">
                  Add-Ons:
                  {item.addOns.candles ? " Candles" : ""}
                  {item.addOns.messageTopper ? " Message Topper" : ""}
                </Text>
              )}
            </>
          )}

          {item.specialInstruction && (
            <Text className="text-base text-gray-600 italic mt-1">
              Special Instructions: {item.specialInstruction}
            </Text>
          )}
          {item.id && (
            <Text className="text-base text-gray-600 italic mt-1">
              Order ID: {item.id}
            </Text>
          )}
          <Text className="text-base text-gray-600 italic mt-1">
            Payment Method: Card
          </Text>
          {item.orderDateTime && (
            <Text className="text-base text-gray-600 italic mt-1">
              Date & Time: {item.orderDateTime}
            </Text>
          )}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Order Status:</Text>
            <ProgressBar
              progress={getOrderStatus(item.status)}
              color="#DB6551"
              style={{ marginTop: 8 }}
            />
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
          {orders.length === 0 ? (
            <Text>No orders found.</Text>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
