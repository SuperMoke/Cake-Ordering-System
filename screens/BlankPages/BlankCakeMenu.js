import { View, Text, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { RadioButton, Button, TextInput } from "react-native-paper";
import { getFirestore, collection, addDoc,query,where,getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function BlankCakeMenu({ route }) {
  const { cake } = route.params;
  const [size, setSize] = useState("size1");
  const [decoration, setDecoration] = useState("decoration1");
  const [filling, setFilling] = useState("filling1");
  const [frosting, setFrosting] = useState("frosting1");
  const [sugarContent, setSugarContent] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [totalPrice, setTotalPrice] = useState(cake.cakeprice);
  const navigation = useNavigation();

  useEffect(() => {
    let price = Number(cake.cakeprice);
    if (size === "Medium (8 Inch)") {
      price = Number(cake.cakeprice) + 300;
    } else if (size === "Large (10 Inch)") {
      price = Number(cake.cakeprice) + 600;
    }
    setTotalPrice(price);
  }, [size, cake.cakeprice]);


  const handleAddtoCart = async () => {
    navigation.navigate("LoginScreenPage")
  };

  const handleBuyNow = async () => {
    navigation.navigate("LoginScreenPage")
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <ScrollView>
        <Image
          source={{ uri: cake.cakeimage }}
          style={{ width: "100%", height: 200 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
          {cake.cakename}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 8 }}>
          Price: ₱{cake.cakeprice}
        </Text>
        <Text style={{ marginTop: 16 }}>{cake.cakedescription}</Text>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Size:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setSize(value)}
            value={size}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="Small (6 Inch)" color="#DB6551" />
              <Text style={{ flex: 1 }}>Small (6 Inch)</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="Medium (8 Inch)" color="#DB6551" />
              <Text style={{ flex: 1 }}>Medium (8 Inch) +300</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="Large (10 Inch)" color="#DB6551" />
              <Text style={{ flex: 1 }}>Large (10 Inch) +600</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Decoration:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setDecoration(value)}
            value={decoration}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.decoration1} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.decoration1}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.decoration2} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.decoration2}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.decoration3} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.decoration3}</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Filling:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setFilling(value)}
            value={filling}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.filling1} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.filling1}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.filling2} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.filling2}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.filling3} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.filling3}</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Frosting:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setFrosting(value)}
            value={frosting}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.frosting1} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.frosting1}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.frosting2} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.frosting2}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value={cake.frosting3} color="#DB6551" />
              <Text style={{ flex: 1 }}>{cake.frosting3}</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Sugar Content:
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setSugarContent(value)}
            value={sugarContent}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="Regular" color="#DB6551" />
              <Text style={{ flex: 1 }}>Regular</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="50 grams" color="#DB6551" />
              <Text style={{ flex: 1 }}>50 grams</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="75 grams" color="#DB6551" />
              <Text style={{ flex: 1 }}>75 grams</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RadioButton value="100 grams" color="#DB6551" />
              <Text style={{ flex: 1 }}>100 grams</Text>
            </View>
          </RadioButton.Group>
        </View>

        <View style={{ marginTop: 16 }}>
          <TextInput
            mode="outlined"
            label="Special Instructions"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
          ></TextInput>
        </View>

        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
          Total Price: ₱{totalPrice}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <Button
            mode="contained"
            labelStyle={{ fontSize: 18 }}
            buttonColor="#DB6551"
            style={{ flex: 1, marginRight: 8 }}
            onPress={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button
            mode="contained"
            labelStyle={{ fontSize: 18 }}
            buttonColor="#DB6551"
            style={{ flex: 1, marginLeft: 8 }}
            onPress={handleAddtoCart}
          >
            Add to Cart
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}