"use client";
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const ActiveOrders = ({ orders, updateOrderStatus }) => {
  const renderOrderItem = ({ item }) => {
    const isCustomized = item.cakeToppings !== undefined;

    return (
      <Card className="mb-4 bg-white shadow-md rounded-lg">
        <Card.Title
          title={`Order Id: ${item.id}`}
          titleStyle="text-lg font-bold"
        />
        <Card.Title
          title={`Date and Time: ${
            item.orderDateTime || new Date().toLocaleString()
          }`}
          titleStyle="text-lg font-bold"
        />

        <Card.Content>
          <Text className="text-xl font-bold mt-2">{item.cakeName}</Text>
          <Text className="mt-1">Price: ₱{item.cakePrice}</Text>
          <Text className="mt-1">Size: {item.cakeSize}</Text>

          {/* Customized Cake specific fields */}
          {isCustomized ? (
            <>
              <Text className="mt-1">
                Toppings: {item.cakeToppings || "None"}
              </Text>
              <Text className="mt-1">Icing Color: {item.cakeIcingColor}</Text>
              <Text className="mt-1">Filling: {item.cakeFilling}</Text>
              <Text className="mt-1">Sugar Level: {item.cakeSugarLevel}%</Text>
              <Text className="mt-1">
                Gluten Free: {item.isGlutenFree ? "Yes" : "No"}
              </Text>
              {item.addOns && (
                <Text className="mt-1">
                  Add-ons:{" "}
                  {Object.entries(item.addOns)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(", ")}
                </Text>
              )}
            </>
          ) : (
            /* Signature Cake specific fields */
            <>
              <Text className="mt-1">Sugar Content: {item.cakeSugar}</Text>
              {item.cakeCalories && (
                <Text className="mt-1">Calories: {item.cakeCalories}</Text>
              )}
            </>
          )}

          <Text className="mt-1">
            Special Instructions: {item.specialInstruction || "None"}
          </Text>

          <Text className="font-bold mt-4">User Information:</Text>
          <Text className="mt-1">Name: {item.userInfo.name}</Text>
          <Text className="mt-1">Email: {item.userInfo.email}</Text>
          <Text className="mt-1">
            Home Address: {item.userInfo.homeaddress}
          </Text>
          <Text className="mt-1">
            Phone Number: {item.userInfo.phonenumber}
          </Text>

          <View className="mt-4 flex-row flex-wrap justify-between">
            <TouchableOpacity
              className={`px-2 py-2 mb-2 rounded-lg w-[31%] ${
                item.status === "Making the Cake"
                  ? "bg-[#f13a72]"
                  : "bg-gray-300"
              }`}
              onPress={() => updateOrderStatus(item.id, "Making the Cake")}
            >
              <Text className="text-white font-bold text-center">
                Making the Cake
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-2 py-2 mb-2 rounded-lg w-[31%] ${
                item.status === "Delivering the Cake"
                  ? "bg-[#f13a72]"
                  : "bg-gray-300"
              }`}
              onPress={() => updateOrderStatus(item.id, "Delivering the Cake")}
            >
              <Text className="text-white font-bold text-center">
                Delivering the Cake
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-2 py-2 mb-2 rounded-lg w-[31%] ${
                item.status === "Finished" ? "bg-[#f13a72]" : "bg-gray-300"
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
  };

  return (
    <ScrollView>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle="p-4"
        />
      ) : (
        <Text className="text-center mt-4">No active orders found.</Text>
      )}
    </ScrollView>
  );
};

export default ActiveOrders;
