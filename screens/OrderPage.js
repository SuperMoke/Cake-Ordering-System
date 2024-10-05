import { View, Text, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Card, ProgressBar } from 'react-native-paper';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, where('userInfo.email', '==', userEmail));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => doc.data());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

  const getOrderStatus = (status) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Making the Cake':
        return 0.33;
      case 'Delivering the Cake':
        return 0.66;
      case 'Finished':
        return 1;
      default:
        return 0;
    }
  };

  const renderOrderItem = ({ item }) => (
    <Card style={{ marginBottom: 16 }}>
      <Card.Cover source={{ uri: item.cakeImage }} />
      <Card.Content>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>{item.cakeName}</Text>
        <Text>Price: ₱{item.cakePrice}</Text>
        <Text>Decoration: {item.cakeDecoration}</Text>
        <Text>Filling: {item.cakeFilling}</Text>
        <Text>Frosting: {item.cakeFrosting}</Text>
        <Text>Sugar Content: {item.cakeSugar}</Text>
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Order Status:</Text>
          <ProgressBar progress={getOrderStatus(item.status)} color="#DB6551" style={{ marginTop: 8 }} />
          <Text style={{ textAlign: 'center', marginTop: 8 }}>{item.status}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        My Orders
      </Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No orders found.</Text>
      )}
    </View>
  );
}