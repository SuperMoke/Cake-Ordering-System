import { View, Pressable, Image } from "react-native";
import { Text } from "react-native-paper";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderData, totalPrice } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Pay with Card",
    });
  }, [navigation]);

  const PaymentOption = ({ icon, title, screenName }) => (
    <Pressable
      className="mb-6"
      onPress={() => navigation.navigate(screenName, { orderData, totalPrice })}
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
      <Text className="text-3xl font-bold mb-8 text-[#333]">
        Choose Payment Method
      </Text>
      <PaymentOption
        icon={require("../assets/debit-card.png")}
        title="Pay with Card"
        screenName="PaymentCard"
      />
      <PaymentOption
        icon={require("../assets/e-wallet.png")}
        title="Pay with E-Wallet"
        screenName="PaymentEWallet"
      />
    </View>
  );
}
