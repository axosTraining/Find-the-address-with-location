import * as Location from 'expo-location';
import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  });

  const [places, setPlaces] = useState([]);

  const fetchRestaurants = (lat, lng) => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=500&type=restaurant&key=AIzaSyDsaFC1kMaY_1AWL_e2cdNsidfhlZZgDcg`)
      .then(response => response.json())
      .then(data => {
        setLocation(data);
        setPlaces(data.results);
        console.log(data.results[0].geometry.location);
      })
      .catch(err => console.error(err));
  }

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
        fetchRestaurants(data.results[0].locations[0].latLng.lat, data.results[0].locations[0].latLng.lng);
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
        <Text>{location && location.status}</Text>
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
        {places.length > 0 && places.map((item, index) => (
          <Marker
            key={index}
            title={item.name}
            description={item.vicinity}
            coordinate={{ latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }}
          />
        ))}
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

