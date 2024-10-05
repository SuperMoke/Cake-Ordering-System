import React, { useState } from "react";
import { View, Text,Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreenPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () =>{
    try{
      if(email === "admin@gmail.com" && password === "admin123"){
        navigation.navigate("AdminScreenPage")
      }
      await signInWithEmailAndPassword(auth,email,password);
      navigation.navigate("HomeScreenPage")
    } catch (error){
    }
  }
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Image
        source={require("../assets/logo.png")}
        className="w-72 h-72"
      />
      <Text className="text-3xl font-bold mb-2">Welcome!</Text>
      <TextInput
        className="w-full mb-4"
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <TextInput
        className="w-full mb-4"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
      />
      <Button
        mode="contained"
        className="mb-5 py-1  w-full"
        labelStyle={{ fontSize: 18 }}
        buttonColor="#DB6551"
        onPress={handleLogin}
      >
        Login
      </Button>
      <Text className="text-base text-center">
        Don't Have an Account?{" "}
        <Text className="text-blue-500" onPress={() => navigation.navigate("RegisterScreenPage")}>Register Here</Text>
      </Text>
    </View>
  );
}