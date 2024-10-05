import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

export default function BlankHomePage() {
  const [cakes, setCakes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "cakes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cakeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCakes(cakeData);
    });

    return () => unsubscribe();
  }, []);

  const handleCardPress = (cake) => {
    navigation.navigate("BlankCakeMenu", { cake });
  };
  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView>
        {cakes.map((cake) => (
          <TouchableOpacity key={cake.id} onPress={() => handleCardPress(cake)}>
            <Card
              mode="outlined"
              className="mb-4"
              style={{ backgroundColor: "#DB6551" }}
            >
              <Card.Cover source={{ uri: cake.cakeimage }} />
              <Card.Title
                title={`${cake.cakename} - ₱${cake.cakeprice}`}
                titleStyle={{ color: "white" }}
              />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}