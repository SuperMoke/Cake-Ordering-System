import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import ActiveOrders from "../AdminPages/OrderPages/ActiveOrders";
import AllOrders from "../AdminPages/OrderPages/AllOrders";
import { parse } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";
import { sendPushNotification } from "../../notificationHelper";

export default function AdminOrderScreen() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const ordersCollection = collection(db, "orders");
    const unsubscribe = onSnapshot(
      ordersCollection,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      },
      (error) => {
        console.error("Error listening to orders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Finished"),
    [orders]
  );
  const allOrders = useMemo(() => orders, [orders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnapshot = await getDoc(orderRef);

      if (orderSnapshot.exists()) {
        await updateDoc(orderRef, { status });

        const orderData = orderSnapshot.data();
        const userToken = orderData.userInfo.expoPushToken;

        let notificationMessage;
        switch (status) {
          case "Making the Cake":
            notificationMessage = "Your cake is now being prepared! 🎂";
            break;
          case "Delivering the Cake":
            notificationMessage = "Your cake is on its way to you! 🚚";
            break;
          case "Finished":
            notificationMessage = "Your cake has been delivered. Enjoy! ✨";
            break;
        }

        if (userToken && notificationMessage) {
          await sendPushNotification(
            userToken,
            "Order Status Update",
            notificationMessage
          );
        }

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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

  const filteredOrders = useMemo(
    () => filterOrdersByDate(activeTab === "active" ? activeOrders : allOrders),
    [activeTab, activeOrders, allOrders, startDate, endDate]
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Admin - Orders</Text>

      <View className="flex-row mb-4">
        <TouchableOpacity
          className={`flex-1 p-3 ${
            activeTab === "active" ? "bg-[#f13a72]" : "bg-gray-300"
          } rounded-l-lg`}
          onPress={() => setActiveTab("active")}
        >
          <Text className="text-white text-center font-bold">
            Active Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-3 ${
            activeTab === "all" ? "bg-[#f13a72]" : "bg-gray-300"
          } rounded-r-lg`}
          onPress={() => setActiveTab("all")}
        >
          <Text className="text-white text-center font-bold">All Orders</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "active" ? (
        <ActiveOrders
          orders={activeOrders}
          updateOrderStatus={updateOrderStatus}
        />
      ) : (
        <AllOrders
          orders={filteredOrders}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          showStartPicker={showStartPicker}
          showEndPicker={showEndPicker}
          setShowStartPicker={setShowStartPicker}
          setShowEndPicker={setShowEndPicker}
        />
      )}
    </View>
  );
}
