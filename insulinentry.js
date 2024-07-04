import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
      {showPending && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter InsulinIntake Value"
            placeholderTextColor="#000000"
            value={insulinIntakes[item.id] || ''}
            onChangeText={text => handleInsulinIntakeChange(item.id, text)}
          />
          <View style={styles.addButtonContainer}>
            <Button
              title="Add Insulin Intake"
              onPress={() => handleUpdateInsulinIntake(item.id)}
            />
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>Insulin Entry</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.pendingButton}>
          <Button
            title="Pending"
            onPress={() => setShowPending(true)}
          />
        </View>
        <View style={styles.completedButton}>
          <Button
            title="Completed"
            onPress={() => navigation.navigate('completedScreen')}
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topContainer: {
    padding: 10,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    height: '12%',
  },
  topText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '12%'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  pendingButton: {
    width: '40%',
    backgroundColor:'#603F83FF',
  },
  completedButton: {
    width: '40%',
    backgroundColor:'#603F83FF',
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#603F83FF', 
    borderRadius: 10,
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#FFFFFF',
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    marginBottom: 7,
    width: '90%',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingHorizontal: 10,
  },
  addButtonContainer: {
    width: '90%',
    marginLeft: '0%',
    marginBottom: 10,
  }
});

export default YourComponent;
