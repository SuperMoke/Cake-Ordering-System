import React, { useLayoutEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

export default function PaymentCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderData, totalPrice } = route.params;

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Pay with Card",
    });
  }, [navigation]);

  const handlePayment = async () => {
    // Implement payment logic here
    try {
      // Validate card details (you can add more validation as needed)
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        alert("Please fill in all card details.");
        return;
      }

      // Save payment info to Firebase
      const paymentsCollection = collection(db, "payments");
      await addDoc(paymentsCollection, {
        cardNumber: cardNumber,
        cardName: cardName,
        expiryDate: expiryDate,
        cvv: cvv,
        paymentMethod: "Card",
        orderData: orderData, // Include order data with IDs in the payment document
        totalPrice: totalPrice,
        paymentDateTime: new Date().toISOString(),
      });
      alert("Your order has been successfully placed");
      navigation.navigate("Order Items");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-10 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold mb-5 text-center">
          Enter Card Details
        </Text>
        <TextInput
          label="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Icon icon="credit-card" />}
          className="mb-4"
        />
        <TextInput
          label="Cardholder Name"
          value={cardName}
          onChangeText={setCardName}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          className="mb-4"
        />
        <View className="flex-row justify-between">
          <TextInput
            label="Expiry Date"
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/YY"
            mode="outlined"
            left={<TextInput.Icon icon="calendar" />}
            className="w-1/2 mr-2 mb-4"
          />
          <TextInput
            label="CVV"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            secureTextEntry
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            className="w-1/2 mr-4 mb-4"
          />
        </View>
        <Button
          mode="contained"
          onPress={handlePayment}
          className="mt-5 py-2 bg-[#fb78a0]"
        >
          Pay Now
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
