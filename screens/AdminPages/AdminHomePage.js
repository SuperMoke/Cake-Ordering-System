import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseconfig";

export default function AdminHomePage() {
  const [orderCount, setOrderCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [signaturecakeCount, setSignatureCakeCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);

  useEffect(() => {
    const unsubscribeOrderCount = fetchOrderCount();
    const unsubscribePendingOrders = fetchPendingOrders();
    const unsubscribeSignatureCakeCount = fetchSignatureCakeCount();
    const unsubscribeTotalEarnings = fetchTotalEarnings();
    const unsubscribeTotalUserCount = fetchTotalUserCount();

    return () => {
      unsubscribeOrderCount();
      unsubscribePendingOrders();
      unsubscribeSignatureCakeCount();
      unsubscribeTotalEarnings();
      unsubscribeTotalUserCount();
    };
  }, []);

  const fetchOrderCount = () => {
    const ordersRef = collection(db, "orders");
    return onSnapshot(ordersRef, (snapshot) => {
      setOrderCount(snapshot.size);
    });
  };

  const fetchTotalEarnings = () => {
    const paymentsRef = collection(db, "payments");
    return onSnapshot(paymentsRef, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        const wholeNumberPrice = Math.floor(doc.data().totalPrice);
        total += wholeNumberPrice;
      });
      setTotalEarnings(total);
    });
  };

  const fetchTotalUserCount = () => {
    const usersRef = collection(db, "users");
    return onSnapshot(usersRef, (snapshot) => {
      setTotalUserCount(snapshot.size);
    });
  };

  const fetchPendingOrders = () => {
    const ordersRef = collection(db, "orders");
    const pendingQuery = query(ordersRef, where("status", "!=", "Finished"));
    return onSnapshot(pendingQuery, (snapshot) => {
      setPendingOrders(snapshot.size);
    });
  };

  const fetchSignatureCakeCount = () => {
    const cakesRef = collection(db, "cakes");
    return onSnapshot(cakesRef, (snapshot) => {
      setSignatureCakeCount(snapshot.size);
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
          Welcome Admin!
        </Text>
      </View>
      <View className="px-4 py-2">
        <View className="grid grid-cols-2 gap-4">
          <View className="flex items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <Ionicons name="cube-outline" size={24} />
            <Text className="text-gray-700 text-lg font-bold">
              {orderCount}
            </Text>
            <Text className="text-gray-500 text-sm">Total Orders</Text>
          </View>
          <View className="flex items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <Ionicons name="cash-outline" size={24} />
            <Text className="text-gray-700 text-lg font-bold">
              ₱ {totalEarnings}
            </Text>
            <Text className="text-gray-500 text-sm">Total Earnings</Text>
          </View>
          <View className="flex items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <Ionicons name="people-outline" size={24} />
            <Text className="text-gray-700 text-lg font-bold">
              {totalUserCount}
            </Text>
            <Text className="text-gray-500 text-sm">Total Users</Text>
          </View>
          <View className="flex items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <Ionicons name="cart-outline" size={24} />
            <Text className="text-gray-700 text-lg font-bold">
              {pendingOrders}
            </Text>
            <Text className="text-gray-500 text-sm">Pending Orders</Text>
          </View>
          <View className="flex items-center border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <Ionicons name="storefront-outline" size={24} />
            <Text className="text-gray-700 text-lg font-bold">
              {signaturecakeCount}
            </Text>
            <Text className="text-gray-500 text-sm">Total Signature Cake</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
