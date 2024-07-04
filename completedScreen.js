import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

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
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headerText}>Insulin Entry</Text>
        <TouchableOpacity style={styles.pendingButton} onPress={() => navigation.navigate('insulinentry')}>
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.completedButton}>
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={completedData}
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
  },
  topContainer: {
    backgroundColor: '#603F83FF',
    padding: 15,
    alignItems: 'center',
    height: '12%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '10%',
  },
  listContainer: {
    padding: 10,
    marginTop: '24%',
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  pendingButton: {
    backgroundColor: '#603F83FF',
    margin: 5,
    borderRadius: 30,
    marginRight: '50%',
    width: '40%',
    height: '70%',
    marginTop: '10%',
  },
  completedButton: {
    backgroundColor: '#603F83FF',
    margin: 5,
    borderRadius: 30,
    marginLeft: '50%',
    width: '40%',
    height: '70%',
    marginTop: '-15%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    left: '14%',
    marginTop: '7%',
  },
});

export default CompletedScreen;
