"use client";
import React, { useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import { parse } from "date-fns";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const AllOrders = ({
  orders,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  showStartPicker,
  showEndPicker,
  setShowStartPicker,
  setShowEndPicker,
}) => {
  const filterFinishedOrders = (orders) =>
    orders.filter((order) => order.status === "Finished");

  const filterOrdersByDate = (orders) => {
    if (!startDate && !endDate) return orders;

    const startTimestamp = startDate
      ? new Date(startDate).setHours(0, 0, 0, 0)
      : null;
    const endTimestamp = endDate
      ? new Date(endDate).setHours(23, 59, 59, 999)
      : null;

    return orders.filter((order) => {
      const orderDate = order.orderDateTime.includes(",")
        ? parse(order.orderDateTime, "M/d/yyyy, h:mm:ss aa", new Date())
        : parse(order.orderDateTime, "M/d/yyyy h:mm aa", new Date());

      if (isNaN(orderDate)) {
        console.warn(
          `Invalid order date for order ID ${order.id}: ${order.orderDateTime}`
        );
        return false;
      }

      const orderTimestamp = orderDate.getTime();

      if (startTimestamp !== null && endTimestamp !== null) {
        return (
          orderTimestamp >= startTimestamp && orderTimestamp <= endTimestamp
        );
      } else if (startTimestamp !== null) {
        return orderTimestamp >= startTimestamp;
      } else if (endTimestamp !== null) {
        return orderTimestamp <= endTimestamp;
      }
      return true;
    });
  };

  const finishedOrders = useMemo(() => filterFinishedOrders(orders), [orders]);
  const filteredOrders = useMemo(
    () => filterOrdersByDate(finishedOrders),
    [finishedOrders, startDate, endDate]
  );

  const renderOrderItem = ({ item }) => {
    const isCustomized = item.cakeToppings !== undefined;

    return (
      <Card className="mb-4 bg-white shadow-md rounded-lg">
        <Card.Title
          title={`Date and Time: ${item.orderDateTime}`}
          titleStyle="text-lg font-bold"
        />

        <Card.Content>
          <Text className="text-xl font-bold mt-2">{item.cakeName}</Text>
          <Text className="mt-1">Price: ₱{item.cakePrice}</Text>
          <Text className="mt-1">Size: {item.cakeSize}</Text>

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
        </Card.Content>
      </Card>
    );
  };

  const exportToCSV = async (orders) => {
    if (orders.length === 0) {
      Alert.alert("No orders to export.");
      return;
    }

    // Define the headers and convert orders to CSV rows
    const header = ["Name of User", "Name of Cake", "Date and Time", "Price"];
    const csvRows = [header];

    orders.forEach((order) => {
      const row = [
        order.userInfo.name,
        order.cakeName,
        `"${order.orderDateTime}"`, // Enclose in quotes to handle commas
        order.cakePrice,
      ];
      csvRows.push(row);
    });

    // Convert the array of arrays into CSV string
    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    // Create a file path
    const fileName = `sales_report.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    // Write the CSV string to the file
    await FileSystem.writeAsStringAsync(fileUri, csvString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share or save the file
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Sharing is not available on this platform");
      return;
    }

    await Sharing.shareAsync(fileUri);
  };

  return (
    <ScrollView>
      <View className="flex-row mb-4 justify-between">
        <TouchableOpacity
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          onPress={() => setShowStartPicker(true)}
        >
          <Text>
            {startDate
              ? new Date(startDate).toLocaleDateString()
              : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 p-2 border border-gray-300 rounded-r-lg"
          onPress={() => setShowEndPicker(true)}
        >
          <Text>
            {endDate
              ? new Date(endDate).toLocaleDateString()
              : "Select End Date"}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartDate(selectedDate.toISOString());
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate ? new Date(endDate) : new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setEndDate(selectedDate.toISOString());
              }
            }}
          />
        )}
      </View>
      <TouchableOpacity
        className="bg-[#f13a72] p-2 rounded-lg mb-2"
        onPress={() => exportToCSV(filteredOrders)}
      >
        <Text className="text-white font-bold text-center">Export CSV</Text>
      </TouchableOpacity>

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle="p-4"
        />
      ) : (
        <Text className="text-center mt-4">
          No finished orders found for the selected date range.
        </Text>
      )}
    </ScrollView>
  );
};

export default React.memo(AllOrders);
