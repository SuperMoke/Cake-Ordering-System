import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  DefaultTheme,
  configureFonts,
} from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";

// Screen imports
import SplashScreenPage from "./screens/SplashScreenPage";
import LoginScreenPage from "./screens/LoginScreenPage";
import RegisterScreenPage from "./screens/RegisterScreenPage";
import HomeScreenPage from "./screens/HomeScreenPage";
import CakeMenuPage from "./screens/CakeMenuPage";
import AddtoCartPage from "./screens/AddtoCartPage";
import OrderPage from "./screens/OrderPage";
import AdminScreenPage from "./screens/AdminScreenPage";
import InquiryScreenPage from "./screens/InquiryScreenPage";

// BlankScreen imports
import BlankHomePage from "./screens/BlankPages/BlankHomePage";
import BlankCakeMenu from "./screens/BlankPages/BlankCakeMenu";

import DrawerNavigator from "./screens/Component/DrawerNavigation";

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

function LogoTitle() {
  return (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("./assets/menu.png")}
    />
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreenPage">
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
          <Stack.Screen
            name="HomeScreenPage"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InquiryScreenPage"
            component={InquiryScreenPage}
          />
          <Stack.Screen name="Cake Menu" component={CakeMenuPage} />
          <Stack.Screen name="Cart Items" component={AddtoCartPage} />
          <Stack.Screen name="Order Items" component={OrderPage} />
          <Stack.Screen
            name="AdminScreenPage"
            component={AdminScreenPage}
            options={({ navigation }) => ({
              headerTitle: (props) => <LogoTitle {...props} />,
              headerLeft: () => null,
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => handleLogout(navigation)}
                    style={{ marginRight: 20 }}
                  >
                    <Ionicons name="log-out-outline" size={30} color="black" />
                  </TouchableOpacity>
                </View>
              ),
            })}
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
      </NavigationContainer>
    </PaperProvider>
  );
}

const handleLogout = async (navigation) => {
  const auth = getAuth();
  try {
    await signOut(auth);
    navigation.navigate("LoginScreenPage");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
