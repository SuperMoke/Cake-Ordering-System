import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, FlatList } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreenPage() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "cakes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cakeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCakes(cakeData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCardPress = (cake) => {
    navigation.navigate("Cake Menu", { cake });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-2 relative"
      onPress={() => handleCardPress(item)}
    >
      <View style={{ position: "relative", width: "102%", height: 220 }}>
        <Image
          source={{ uri: item.cakeimage }}
          className="h-32 w-full rounded-lg"
          style={{ width: "100%", height: "100%" }}
        />

        <View className="absolute bottom-0 left-0  w-full backdrop-blur-lg bg-[#fb78a0]">
          <Text className="text-lg font-bold text-white ml-2">
            {item.cakename}
          </Text>
          <Text className="text-sm font-bold text-black ml-2">
            ₱{item.cakeprice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="mx-2">
        <TouchableOpacity
          className="mb-6"
          onPress={() => navigation.navigate("Cake Customization")}
        >
          <View className="bg-[#fb78a0] rounded-xl p-4 flex-row items-center shadow-md">
            <View className="flex-1 pr-4">
              <Text className="text-lg font-bold text-white  mb-2">
                Customize Your Own Cake
              </Text>
              <Text className="text-sm text-black">
                Create your dream cake by choosing size, flavor, frosting, and
                toppings
              </Text>
            </View>
            <Image
              source={require("../assets/Firefly redesign 15196.jpg")}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
      <Text className="text-lg ml-4 font-bold text-gray-800 ">
        Our Signature Cakes
      </Text>
      <View className="p-2 ">
        <FlatList
          data={cakes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ScrollView>
  );
}
