import { View, Pressable, Image, Alert } from "react-native";
import { Text } from "react-native-paper";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PaymentEWallet() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Payment",
    });
  }, [navigation]);

  const handlePaymentPress = (paymentMethod) => {
    Alert.alert("Payment Confirmation", `Redirecting you to ${paymentMethod}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => console.log(`${paymentMethod} payment initiated`),
      },
    ]);
  };

  const PaymentOption = ({ icon, title, paymentMethod }) => (
    <Pressable
      className="mb-6"
      onPress={() => handlePaymentPress(paymentMethod)}
    >
      <View className="bg-[#fb78a0] backdrop-blur-xl rounded-2xl flex-col items-center shadow-lg p-6 w-64">
        <Image source={icon} className="w-20 h-20 mb-4" />
        <Text className="text-xl text-center font-bold text-white">
          {title}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 justify-center items-center bg-[#fff5f7]">
      <PaymentOption
        icon={require("../assets/debit-card.png")}
        title="Pay with Gcash"
        paymentMethod="Gcash"
      />
      <PaymentOption
        icon={require("../assets/e-wallet.png")}
        title="Pay with Maya"
        paymentMethod="Maya"
      />
    </View>
  );
}
