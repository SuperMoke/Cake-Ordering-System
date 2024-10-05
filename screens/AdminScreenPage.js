import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseconfig";
import { Card } from "react-native-paper";

export default function AdminScreenPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const querySnapshot = await getDocs(ordersCollection);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);
      if (orderSnapshot.exists()) {
        await updateDoc(orderRef, { status });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        console.error("Order document does not exist:", orderId);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <Card className="mb-4 bg-white shadow-md rounded-lg">
      <Card.Title
        title={`Date and Time: ${item.orderDateTime}`}
        titleStyle="text-lg font-bold"
      />
      <Card.Title
        title={`Order ID: ${item.id}`}
        titleStyle="text-lg font-bold"
      />
      <Card.Content>
        <Text className="text-xl font-bold mt-2">{item.cakeName}</Text>
        <Text className="mt-1">Price: ₱{item.cakePrice}</Text>
        <Text className="mt-1">Decoration: {item.cakeDecoration}</Text>
        <Text className="mt-1">Filling: {item.cakeFilling}</Text>
        <Text className="mt-1">Frosting: {item.cakeFrosting}</Text>
        <Text className="mt-1">Sugar Content: {item.cakeSugar}</Text>
        <Text className="mt-1">
          Special Instructions: {item.SpecialInstruction}
        </Text>
        <Text className="font-bold mt-4">User Information:</Text>
        <Text className="mt-1">Name: {item.userInfo.name}</Text>
        <Text className="mt-1">Email: {item.userInfo.email}</Text>
        <Text className="mt-1">Home Address: {item.userInfo.homeaddress}</Text>
        <Text className="mt-1">Phone Number: {item.userInfo.phonenumber}</Text>
        <View className="mt-4 flex-row flex-wrap justify-between">
          <TouchableOpacity
            className={`px-2 py-2 mb-2 rounded-lg w-1/3 ${
              item.status === "Making the Cake" ? "bg-[#DB6551]" : "bg-gray-300"
            }`}
            onPress={() => updateOrderStatus(item.id, "Making the Cake")}
          >
            <Text className="text-white font-bold text-center">
              Making the Cake
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-2 py-2 mb-2 rounded-lg w-1/3 ${
              item.status === "Delivering the Cake"
                ? "bg-[#DB6551]"
                : "bg-gray-300"
            }`}
            onPress={() => updateOrderStatus(item.id, "Delivering the Cake")}
          >
            <Text className="text-white font-bold text-center">
              Delivering the Cake
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-2 py-2 mb-2 rounded-lg w-1/3 ${
              item.status === "Finished" ? "bg-[#DB6551]" : "bg-gray-300"
            }`}
            onPress={() => updateOrderStatus(item.id, "Finished")}
          >
            <Text className="text-white font-bold text-center">
              Finish Order
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4 ">
      <Text className="text-2xl font-bold mb-4">Admin - All Orders</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle="p-4"
        />
      ) : (
        <Text>No orders found.</Text>
      )}
    </View>
  );
}
