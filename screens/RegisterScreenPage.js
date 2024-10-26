import { View, Text, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function RegisterScreenPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [homeaddress, setHomeaddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        homeaddress,
        phonenumber,
        UID: user.uid,
      });

      console.log("User registered successfully!");
      navigation.navigate("LoginScreenPage");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Image
        source={require("../assets/logo.png")}
        className="w-32 h-32 mb-4"
      />
      <Text className="text-3xl font-bold mb-2">Welcome!</Text>
      <TextInput
        className="w-full mb-4"
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
      />
      <TextInput
        className="w-full mb-4"
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
      />
      <TextInput
        className="w-full mb-4"
        label="Home Address"
        value={homeaddress}
        onChangeText={setHomeaddress}
        mode="outlined"
      />
      <TextInput
        className="w-full mb-4"
        label="Phone Number"
        value={phonenumber}
        onChangeText={setPhonenumber}
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
        buttonColor="#f13a72"
        onPress={handleRegister}
      >
        Register
      </Button>
      <Text className="text-base text-center">
        Already Have An Account?{" "}
        <Text
          className="text-blue-500"
          onPress={() => navigation.navigate("LoginScreenPage")}
        >
          Login Here
        </Text>
      </Text>
    </View>
  );
}
