import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Text,
  RadioButton,
  Button,
  TextInput,
  Checkbox,
  Chip,
} from "react-native-paper";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseconfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";

const CustomizationCake = () => {
  const [size, setSize] = useState('6"');
  const [topping, setTopping] = useState("Plain");
  const [icingColor, setIcingColor] = useState({
    value: "",
    disabled: false,
    selected: "",
  });

  const [filling, setFilling] = useState("Buttercream");
  const [sugarLevel, setSugarLevel] = useState(50);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [addOns, setAddOns] = useState({
    candles: false,
    messageTopper: false,
  });
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const navigation = useNavigation();

  const handleToppingChange = (value) => {
    setTopping(value);
    if (value !== "Plain") {
      setIcingColor({ value: "", disabled: true, selected: "" });
    } else {
      setIcingColor({ value: "", disabled: false, selected: "" });
    }
  };

  const sugarLevels = [
    { value: 0, label: "Sugar Free" },
    { value: 25, label: "Low Sugar" },
    { value: 50, label: "Regular" },
    { value: 75, label: "High Sugar" },
    { value: 100, label: "Extra Sweet" },
  ];

  const toppingPrices = {
    Plain: 0,
    "Crushed almond nuts": 399,
    Strawberry: 499,
    Oreo: 299,
    "Fruit berries/mixed berries": 499,
    "Peach Mangoes": 499,
    "Mixed berry": 499,
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.email);
      } else {
        navigation.navigate("LoginScreenPage");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserInfo = async (email) => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserInfo(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  // Ensure you've exported storage from your firebaseconfig

  const handleAddToCart = async () => {
    try {
      let imageToUpload = null;

      if (topping && topping !== "Plain") {
        const toppingImage = Image.resolveAssetSource(
          cakeImages.toppings[topping]
        );
        if (toppingImage) {
          imageToUpload = {
            uri: toppingImage.uri,
            name: `topping-${topping}.png`,
          };
        }
      } else if (icingColor.value && icingColor.value !== "White") {
        const icingImage = Image.resolveAssetSource(
          cakeImages.icingColors[icingColor.value]
        );
        if (icingImage) {
          imageToUpload = {
            uri: icingImage.uri,
            name: `icing-${icingColor.value}.png`,
          };
        }
      } else {
        const baseImage = Image.resolveAssetSource(
          require("../assets/Cake/Base.png")
        );
        if (baseImage) {
          imageToUpload = { uri: baseImage.uri, name: "base.png" };
        }
      }

      const storage = getStorage();
      let imageUrl = "";

      if (imageToUpload) {
        const storageRef = ref(
          storage,
          `cakeOrders/${Date.now()}-${imageToUpload.name}`
        );
        const response = await fetch(imageToUpload.uri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      const cartItem = {
        cakeName: "Customized Cake",
        cakeImage: imageUrl,
        cakeSize: size,
        cakeToppings: topping,
        cakeIcingColor: icingColor.value || "White",
        cakeFilling: filling,
        cakeSugarLevel: sugarLevel,
        isGlutenFree: isGlutenFree,
        addOns: addOns,
        specialInstruction: message,
        cakePrice: calculateTotalPrice(),
        userInfo: userInfo,
      };

      await addDoc(collection(db, "cart"), cartItem);
      alert("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const cakeImages = {
    toppings: {
      Plain: null,
      "Crushed almond nuts": require("../assets/Cake/Toppings - Crushed Almond Nuts.png"),
      Strawberry: require("../assets/Cake/Toppings - Strawberry.png"),
      Oreo: require("../assets/Cake/Topping - Cookies & Cream.png"),
      "Fruit berries/mixed berries": require("../assets/Cake/Toppings - Mixed Berries.png"),
      "Peach Mangoes": require("../assets/Cake/Toppings - Peach Mangoes.png"),
      "Mixed berry": require("../assets/Cake/Toppings - Mixed Berries.png"),
    },
    icingColors: {
      White: require("../assets/Cake/Icing - White.png"),
      Blue: require("../assets/Cake/Icing - Blue.png"),
      Red: require("../assets/Cake/Icing - Red.png"),
      Pink: require("../assets/Cake/Icing - Pink.png"),
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity
        className="absolute top-10 left-2.5 p-2.5 rounded-full z-10"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#f13a72" />
      </TouchableOpacity>
      <View className="flex items-center justify-center absolute top-5 left-0 right-0 h-64">
        <Image
          source={require("../assets/Cake/Base.png")}
          className="h-80 w-80 absolute"
        />
        {icingColor.value !== "White" && (
          <Image
            source={cakeImages.icingColors[icingColor.value]}
            className="h-80 w-80 absolute"
          />
        )}
        {topping !== "Plain" && (
          <Image
            source={cakeImages.toppings[topping]}
            className="h-80 w-80 absolute"
          />
        )}
      </View>

      <View className="flex-1 mt-72">
        <ScrollView className="flex-1 bg-white rounded-t-[30px] px-5 pt-5">
          <Text className="text-3xl font-bold mb-5">Customize Your Cake</Text>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Size</Text>
            <View className="flex-row justify-between">
              {['6"', '9"', '12"'].map((option) => (
                <Chip
                  key={option}
                  className="rounded-full"
                  selected={size === option}
                  onPress={() => setSize(option)}
                  style={{
                    backgroundColor: size === option ? "#f13a72" : "#e0e0e0",
                  }}
                  textStyle={{ color: size === option ? "white" : "black" }}
                >
                  {option} - ₱
                  {option === '6"' ? 580 : option === '9"' ? 799 : 999}
                </Chip>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Toppings</Text>
            <RadioButton.Group
              onValueChange={handleToppingChange}
              value={topping}
            >
              {Object.entries(toppingPrices).map(([option, price]) => (
                <View
                  key={option}
                  className="flex-row items-center justify-between mb-2"
                >
                  <View className="flex-row items-center">
                    <RadioButton value={option} color="#f13a72" />
                    <Text className="text-base ml-2">{option}</Text>
                  </View>
                  <Text className="text-base">
                    {price > 0 ? `+ ₱${price}` : "Free"}
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Icing Color</Text>
            <View className="flex-row flex-wrap">
              {["White", "Blue", "Red", "Pink"].map((option) => (
                <Chip
                  key={option}
                  className="rounded-full"
                  selected={icingColor.selected === option}
                  onPress={() =>
                    setIcingColor({
                      ...icingColor,
                      value: option,
                      selected: option,
                    })
                  }
                  style={{
                    backgroundColor:
                      icingColor.selected === option ? "#f13a72" : "#e0e0e0",
                    margin: 4,
                  }}
                  textStyle={{
                    color: icingColor.selected === option ? "white" : "black",
                  }}
                  disabled={icingColor.disabled}
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Fillings</Text>
            <RadioButton.Group onValueChange={setFilling} value={filling}>
              {[
                "Buttercream",
                "Chocolate Mousse",
                "Strawberry",
                "Vanilla Custard",
                "Salted Caramel Buttercream",
              ].map((option) => (
                <View key={option} className="flex-row items-center mb-2">
                  <RadioButton value={option} color="#f13a72" />
                  <Text className="text-base ml-2">{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Sugar Level</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={100}
              step={25}
              value={sugarLevel}
              onValueChange={setSugarLevel}
              minimumTrackTintColor="#f13a72"
              maximumTrackTintColor="#fb78a0"
              thumbTintColor="#DB6551"
            />
            <View className="flex-row justify-between mt-2">
              {sugarLevels.map((level) => (
                <Text key={level.value} className="text-xs text-center">
                  {level.label}
                </Text>
              ))}
            </View>
            <Text className="text-base text-center mt-2 font-bold">
              {sugarLevel} grams -{" "}
              {sugarLevels.find((level) => level.value === sugarLevel)?.label}
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-xl font-bold mb-2">Add-ons</Text>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Checkbox
                  status={addOns.candles ? "checked" : "unchecked"}
                  onPress={() =>
                    setAddOns({ ...addOns, candles: !addOns.candles })
                  }
                  color="#f13a72"
                />
                <Text className="text-base ml-2">Candle x 1</Text>
              </View>
              <Text className="text-base">+ ₱20</Text>
            </View>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Checkbox
                  status={addOns.messageTopper ? "checked" : "unchecked"}
                  onPress={() =>
                    setAddOns({
                      ...addOns,
                      messageTopper: !addOns.messageTopper,
                    })
                  }
                  color="#f13a72"
                />
                <Text className="text-base ml-2">
                  Personalized Message Topper
                </Text>
              </View>
              <Text className="text-base">+ ₱50</Text>
            </View>
            {addOns.messageTopper && (
              <TextInput
                mode="outlined"
                label="Message"
                value={message}
                onChangeText={setMessage}
                className="bg-gray-100 mb-5"
                multiline
              />
            )}
          </View>

          <View className="mb-5 flex-row items-center justify-center">
            <View className="flex-row items-center">
              <Checkbox
                status={isGlutenFree ? "checked" : "unchecked"}
                onPress={() => setIsGlutenFree(!isGlutenFree)}
                color="#f13a72"
              />
              <Text className="text-base ml-2">Gluten Free</Text>
            </View>
            <Text className="text-base">+ ₱399</Text>
          </View>
        </ScrollView>
      </View>

      <View className="bg-gray-100 py-2 rounded-t-[30px] shadow-lg flex-row">
        <View className="flex-col justify-between items-center mx-4 mt-2">
          <Text className="text-base ">Total Price</Text>
          <Text className="text-lg font-bold text-[#f13a72]">
            ₱{calculateTotalPrice()}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          className="rounded-full bg-[#f13a72] px-16 my-2"
          labelStyle="text-lg font-bold"
        >
          Add to Cart
        </Button>
      </View>
    </SafeAreaView>
  );

  function calculateTotalPrice() {
    let basePrice = size === '6"' ? 580 : size === '9"' ? 799 : 999;
    let toppingPrice = toppingPrices[topping] || 0;
    let addOnsPrice = 0;

    if (addOns.candles) {
      addOnsPrice += 20;
    }
    if (addOns.messageTopper) {
      addOnsPrice += 50;
    }
    if (isGlutenFree) {
      addOnsPrice += 399;
    }

    return basePrice + toppingPrice + addOnsPrice;
  }
};

export default CustomizationCake;
