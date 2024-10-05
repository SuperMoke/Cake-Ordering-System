import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";

export default function InquiryScreenPage() {
  return (
    <View className="flex-1 p-5  bg-gray-100 items-center">
      <View className="">
        <Image
          className="w-80 h-60 mb-4"
          source={require("../assets/Firefly redesign two person talking 76216.jpg")}
        />
        <Text className="text-xl font-bold mb-4">
          Do you have special requests?
        </Text>
        <TextInput
          className="mb-2.5 py-3"
          mode="outlined"
          multiline
          numberOfLines={6}
        />
        <TouchableOpacity className="bg-[#f13a72] p-3 rounded-md items-center mt-2">
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
