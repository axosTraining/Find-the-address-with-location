import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [address, setAddress] = useState('');

  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  });

  const [coordinates, setCoordinates] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
  });

  const [title, setTitle] = useState('Haaga-Helia')

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let locationHere = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: locationHere.coords.latitude,
        longitude: locationHere.coords.longitude
      });
      setCoordinates({
        latitude: locationHere.coords.latitude,
        longitude: locationHere.coords.longitude
      });
      setTitle('You are here!')
    })();
  }, []);

  const fetchAddress = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=sjICJIwWbLnpiETDTUcD6kcmNXjg90tJ&location=${address}`,
      {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        setRegion({
          ...region,
          latitude: data.results[0].locations[0].latLng.lat,
          longitude: data.results[0].locations[0].latLng.lng
        });
        setCoordinates({
          latitude: data.results[0].locations[0].latLng.lat,
          longitude: data.results[0].locations[0].latLng.lng
        });
        setTitle(address)
      })
      .catch(err => console.error(err));
  }

  const findAddress = () => {
    if (address === '') {
      alert('Type in address first');
    } else {
      fetchAddress();
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.textfield}
          onChangeText={currValue => setAddress(currValue)}
          value={address}
        />
        <Button
          title="Find"
          onPress={findAddress}
        />
      </View>
      <MapView
        style={{ width: '100%', height: '100%' }}
        region={region}
      >
        <Marker
          coordinate={coordinates}
          title={title}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  input: {
    flexDirection: 'row',
    marginBottom: 40
  },
  textfield: {
    height: 50,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
  }
});

