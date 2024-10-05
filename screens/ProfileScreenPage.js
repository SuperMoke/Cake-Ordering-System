import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Text, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreenPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Query to find the user document based on email
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserId(userDoc.id);
          const userData = userDoc.data();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setLocation(userData.homeaddress || "");
          setPhonenumber(userData.phonenumber || "");
          setProfileImage(userData.imageUrl || null);
        } else {
          Alert.alert("Error", "User profile not found.");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `profile_${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `profile_images/${filename}`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      if (!userId) throw new Error("User ID not found");

      let imageUrl = profileImage;
      if (profileImage && !profileImage.startsWith("http")) {
        imageUrl = await uploadImage(profileImage);
      }

      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        name,
        email,
        homeaddress,
        phonenumber,
        imageUrl,
      });

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center mt-6">
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/Avatar.png")
            }
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-center mt-2 text-blue-500">Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <Text className="text-base   mb-1.25">Name:</Text>
        <TextInput
          className="bg-gray-100 p-2 rounded-lg mb-4"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text className="text-base  mb-1.25">Address:</Text>
        <TextInput
          className="bg-gray-100 p-2 rounded-lg mb-4"
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <Text className="text-base  mb-1.25">Phone Number:</Text>
        <TextInput
          className="bg-gray-100 p-2 rounded-lg mb-4"
          placeholder="Location"
          value={phonenumber}
          onChangeText={setPhonenumber}
        />

        <Button
          mode="contained"
          onPress={updateProfile}
          loading={isLoading}
          disabled={isLoading}
          className="mt-4 bg-[#f13a72]"
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}
