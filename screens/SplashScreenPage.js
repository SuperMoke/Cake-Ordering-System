import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreenPage() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image 
        source={require('../assets/logo.png')}
        className="w-72 h-72"
      />
      <View style={{ position: 'absolute', bottom: 50 }}>
        <Button
          mode="contained"
          style={{ marginBottom: 10, paddingVertical: 10, paddingHorizontal: 20, width: 256 }}
          labelStyle={{ fontSize: 18 }}
          buttonColor="#DB6551"
          onPress={() => navigation.navigate("LoginScreenPage")}
        >
          Login
        </Button>
        <Button
          mode="outlined"
          style={{ paddingVertical: 10, paddingHorizontal: 20, width: 256, borderColor: "#DB6551" }}
          labelStyle={{ fontSize: 18 }}
          onPress={() => navigation.navigate("BlankHomePage")}
        >
          Browse Cake
        </Button>
      </View>
    </View>
  );
}
