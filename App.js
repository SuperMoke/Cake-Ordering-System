import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
} from "react-native-paper";
import { Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Screen imports
import SplashScreenPage from "./screens/SplashScreenPage";
import LoginScreenPage from "./screens/LoginScreenPage";
import RegisterScreenPage from "./screens/RegisterScreenPage";
import HomeScreenPage from "./screens/HomeScreenPage";
import CakeMenuPage from "./screens/CakeMenuPage";
import AddtoCartPage from "./screens/AddtoCartPage";
import OrderPage from "./screens/OrderPage";
import InquiryScreenPage from "./screens/InquiryScreenPage";
import ChatScreen from "./screens/ChatScreen";
import CustomizationCake from "./screens/CustomizationCake";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentCardScreen from "./screens/PaymentCardScreen";
import PaymentEWallet from "./screens/PaymentEWallet";

// BlankScreen imports
import BlankHomePage from "./screens/BlankPages/BlankHomePage";
import BlankCakeMenu from "./screens/BlankPages/BlankCakeMenu";

// Admin Screen
import AdminHomePage from "./screens/AdminPages/AdminHomePage";
import AdminOrderScreen from "./screens/AdminPages/AdminOrderScreen";
import AdminMessageScreen from "./screens/AdminPages/AdminMessageScreen";
import AdminChatScreen from "./screens/AdminPages/AdminChatScreen";
import DrawerNavigator_Admin from "./screens/Component/DrawerNavigation_Admin";
import AddCakeScreen from "./screens/AdminPages/AdminAddCake";
import EditCakeScreen from "./screens/AdminPages/AdminEditCake";

import DrawerNavigator from "./screens/Component/DrawerNavigation";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

const fontConfig = {
  default: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "sans-serif-light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "sans-serif-thin",
      fontWeight: "normal",
    },
  },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: "black",
    text: "black",
  },
  roundness: 0,
};

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

function LogoTitle() {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("./assets/menu.png")}
    />
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="LoginScreenPage">
      <Stack.Screen
        name="SplashScreenPage"
        component={SplashScreenPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreenPage"
        component={LoginScreenPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreenPage"
        component={RegisterScreenPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreenPage">
      <Stack.Screen
        name="HomeScreenPage"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="InquiryScreenPage" component={InquiryScreenPage} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Cake Menu" component={CakeMenuPage} />
      <Stack.Screen name="Cart Items" component={AddtoCartPage} />
      <Stack.Screen name="Order Items" component={OrderPage} />
      <Stack.Screen name="PaymentCard" component={PaymentCardScreen} />
      <Stack.Screen name="PaymentEWallet" component={PaymentEWallet} />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cake Customization"
        component={CustomizationCake}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BlankHomePage"
        component={BlankHomePage}
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="BlankCakeMenu"
        component={BlankCakeMenu}
        options={{ headerTitle: "Cake Menu" }}
      />
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator initialRouteName="AdminHomePage">
      <Stack.Screen
        name="AdminHomePage"
        component={DrawerNavigator_Admin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminOrderScreen"
        component={DrawerNavigator_Admin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminMessageScreen"
        component={DrawerNavigator_Admin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminProductScreen"
        component={DrawerNavigator_Admin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddCakeScreen"
        component={AddCakeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditCakeScreen"
        component={EditCakeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AdminChatScreen" component={AdminChatScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreenPage />;
  }

  return (
    <NavigationContainer>
      {!user ? <AuthStack /> : user.isAdmin ? <AdminStack /> : <AppStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <RootNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
