import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Colors from '../constants/Colors';

const MapScreen = props => {
  const [selectedLocation, setSelectedLocation] = useState()

  const mapRegion = {
    latitude: 37.78,
    longitude: -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const selectedLocationHandler = event => {
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  }

  const savedPickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        'Nothing to save', 
        'You need to pick some location first',
        [{text: 'Okay'}]);
      return;
    }
    props.navigation.navigate('NewPlace', {pickedLocation: selectedLocation});
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({saveLocation: savedPickedLocationHandler});
  }, [savedPickedLocationHandler])

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView style={styles.map} region={mapRegion} onPress={selectedLocationHandler} >
      {markerCoordinates && <Marker title='Picked Location' coordinate={markerCoordinates}></Marker>}
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  saveFn = navData.navigation.getParam('saveLocation');
  return {
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
        <Text style={styles.headerButtonText}>Save</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 20,
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primary,
  },
});

export default MapScreen;
