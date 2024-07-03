// CompletedScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const CompletedScreen = ({ navigation }) => {
  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.40.121/Database/completedScreen.php`);
      if (response.data.status === 'success') {
        const data = response.data.data;
        setCompletedData(data.filter(item => item.status === 'completed'));
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text>id: {item.id}</Text>
      <Text>Username: {item.username}</Text>
      <Text>Date: {item.datetime}</Text>
      <Text>Note: {item.note}</Text>
      <Text>Session: {item.session}</Text>
      <Text>Sugar Concentration: {item.sugar_concentration}</Text>
      <Text>Insulin Intake: {item.insulinintake}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0' }}>
        <Icon name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Completed Data</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button
          title="Pending"
          onPress={() => navigation.navigate('insulinentry')}
        />
        <Button
          title="Completed"
        />
      </View>
      <View style={{ padding: 10 }}>
        <FlatList
          data={completedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default CompletedScreen;
