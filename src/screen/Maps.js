import React, {Component, Fragment} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Header, Left, Right, Body, Title, Item} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';
import firebase from '../firebase/index';
import AsyncStorage from '@react-native-community/async-storage';

class Maps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapRegion: null,
      lastLat: 0,
      lastLong: 0,
      users: [],
      idu: '',
    };
  }

  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    this.setState({idu: uid});
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(() => {
      geolocation.getCurrentPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
          };
          this.onRegionChange(region, region.latitude, region.longitude);
        },
        error => console.log(error),
      );
    });
    await firebase
      .database()
      .ref('user/')
      .on('value', result => {
        let datas = result.val();
        if (datas !== null) {
          let users = Object.values(datas);
          this.setState({
            users,
          });
        }
      });
  };

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong,
    });
  }

  render() {
    const {idu} = this.state;

    return (
      <Fragment>
        <Header>
          <Left>
            <TouchableOpacity
              style={styles.backAr}
              onPress={() => {
                this.props.navigation.navigate('HomePage');
              }}>
              <FontAwesomeIcon style={{color: 'white'}} icon={faArrowLeft} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={styles.title}>Maps</Title>
          </Body>
          <Right />
        </Header>
        <View>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsCompass={true}
            zoomControlEnabled={true}
            followsUserLocation={true}
            region={this.state.mapRegion}>
            {this.state.users.map((data, index) => {
              return (
                <Marker
                  title={data.id === idu ? 'You' : data.name}
                  key={index}
                  description={data.status}
                  coordinate={{
                    latitude: data.latitude,
                    longitude: data.longtitude,
                  }}>
                  <View style={{backgroundColor: '#8db6f7', borderRadius: 15}}>
                    <Image
                      source={{uri: data.image}}
                      style={{width: 40, height: 40, borderRadius: 50}}
                    />
                  </View>
                </Marker>
              );
            })}
          </MapView>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  backAr: {
    paddingLeft: 10,
  },
  title: {
    fontSize: 19,
  },
  map: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
});

export default Maps;
