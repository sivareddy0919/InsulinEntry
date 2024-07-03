import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const YourComponent = ({ navigation }) => {
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [insulinIntakes, setInsulinIntakes] = useState({});
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.40.121/Database/insulinlevel.php`);
      if (response.data.status === 'success') {
        const data = response.data.data;
        setPendingData(data.filter(item => item.status !== 'completed'));
        setCompletedData(data.filter(item => item.status === 'completed'));
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateInsulinIntake = async (id) => {
    try {
      const insulinIntake = insulinIntakes[id] || '';
      const response = await axios.put(`http://192.168.40.121/Database/insulinentry.php`, {
        id: id,
        insulinintake: insulinIntake
      });
      if (response.data.status === 'success') {
        // Update local state with updated insulin intake
        const updatedItem = pendingData.find(item => item.id === id);
        updatedItem.insulinintake = insulinIntake;
        updatedItem.status = 'completed';
        
        setPendingData(pendingData.filter(item => item.id !== id));
        setCompletedData([...completedData, updatedItem]);
        
        Alert.alert('Success', 'Insulin intake updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update insulin intake');
      }
    } catch (error) {
      console.error('Error updating insulin intake:', error);
      Alert.alert('Error', 'Failed to update insulin intake');
    }
  };

  const handleInsulinIntakeChange = (id, value) => {
    setInsulinIntakes(prev => ({ ...prev, [id]: value }));
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
      {showPending && (
        <>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 5, paddingHorizontal: 10 }}
            placeholder="Update Insulin Intake"
            value={insulinIntakes[item.id] || ''}
            onChangeText={text => handleInsulinIntakeChange(item.id, text)}
          />
          <Button
            title="Update Insulin Intake"
            onPress={() => handleUpdateInsulinIntake(item.id)}
          />
        </>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0' }}>
        <Icon name="arrow-back" size={24} color="black" />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Your Text Here</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button
          title="Pending"
          onPress={() => setShowPending(true)}
        />
        <Button
          title="Completed"
          onPress={() => navigation.navigate('completedScreen')}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          {showPending ? 'Pending Data' : 'Completed Data'}
        </Text>
        <FlatList
          data={showPending ? pendingData : completedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default YourComponent;
