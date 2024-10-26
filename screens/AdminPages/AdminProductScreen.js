import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Button } from "react-native-paper";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebaseconfig";

export default function AdminProductScreen() {
  const [cakes, setCakes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Set up real-time listener
    const cakesCollection = collection(db, "cakes");
    const unsubscribe = onSnapshot(
      cakesCollection,
      (snapshot) => {
        const cakesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCakes(cakesList);
      },
      (error) => {
        console.error("Error fetching cakes:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "cakes", id));
      Alert.alert("Success", "Cake deleted successfully.");
      // No need to manually fetch - onSnapshot will handle the update
    } catch (error) {
      console.error("Error deleting cake:", error);
      Alert.alert("Error", "Failed to delete cake");
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}>
      <View className="flex items-center justify-center">
        <Image
          source={{ uri: item.cakeimage }}
          style={{ width: 200, height: 200 }}
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.cakename}</Text>
      <Text style={{ marginVertical: 5 }}>{item.cakedescription}</Text>
      <Text>Price: ₱{item.cakeprice}</Text>
      <Text>Calories: {item.cakecaloriecount}</Text>
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <Button
          mode="contained"
          className="bg-[#f13a72]"
          onPress={() => navigation.navigate("EditCakeScreen", { cake: item })}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleDelete(item.id)}
          style={{ marginLeft: 10 }}
        >
          Delete
        </Button>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={cakes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <Button
        mode="contained"
        className="bg-[#f13a72]"
        onPress={() => navigation.navigate("AddCakeScreen")}
        style={{ margin: 15 }}
      >
        Add New Cake
      </Button>
    </View>
  );
}
