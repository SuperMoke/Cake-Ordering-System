import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AdminHomePage from "../AdminPages/AdminHomePage";
import AdminOrderScreen from "../AdminPages/AdminOrderScreen";
import AdminMessageScreen from "../AdminPages/AdminMessageScreen";
import AdminProductScreen from "../AdminPages/AdminProductScreen";

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  getFirestore,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth } from "../../firebaseconfig";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [displayName, setDisplayName] = React.useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where("UID", "==", user.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setDisplayName(doc.data().name);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (navigation) => {
    try {
      await auth.signOut();
      navigation.navigate("LoginScreenPage");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View className="h-40 flex justify-center items-center mb-2.5">
          <Image
            className="w-20 h-20 object-contain"
            source={require("../../assets/Avatar.png")}
          />
          <Text className="text-lg font-bold mt-2">{displayName}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ padding: 5, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <DrawerItem
          label="Logout"
          onPress={() => handleLogout(props.navigation)}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
        />
      </View>
    </View>
  );
}

export default function DrawerNavigator_Admin() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: "#f19fb7", width: 250 },
        drawerLabelStyle: { fontSize: 16 },
        drawerActiveBackgroundColor: "#f3efef",
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#0c0c0c",
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#000",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={AdminHomePage}
        options={({ navigation }) => ({
          headerTitle: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        })}
      />
      <Drawer.Screen
        name="Chat"
        component={AdminMessageScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Order"
        component={AdminOrderScreen}
        options={{
          headerTitle: "Order",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Product"
        component={AdminProductScreen}
        options={{
          headerTitle: "Signature Cake",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
