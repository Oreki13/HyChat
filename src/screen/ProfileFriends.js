import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import {Header, Left, Right, Body, Title} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import firebase from '../firebase/index';

class ProfileFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      long: null,
      address: '',
      name: '',
      status: '',
      image: '',
      id: '',
    };

    this.getLocation();
  }
  componentDidMount = async () => {
    const uid = this.props.route.params.idNya;
    console.log('IDNYA', this.props.route);

    await firebase
      .database()
      .ref(`user/${uid}`)
      .once('value')
      .then(data => {
        this.setState({
          id: uid,
          name: data.val().name,
          status: data.val().status,
          image: data.val().image,
          lat: data.val().latitude,
          long: data.val().longtitude,
        });
        console.log(this.state);
      });
    let pos = {
      lat: this.state.lat,
      lng: this.state.long,
    };
    await Geocoder.geocodePosition(pos)
      .then(res => {
        console.log('GEOCODEsR', res);

        this.setState({
          address: res[0].formattedAddress,
        });
      })
      .catch(err => console.log(err));
  };

  getLocation = () => {
    geolocation.getCurrentPosition(info => {
      // console.log(info);

      this.setState({
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
  };

  render() {
    console.log(this.state);

    return (
      <Fragment>
        <Header style={{backgroundColor: '#002736'}}>
          <StatusBar backgroundColor="#002736" barStyle="default" />
          <Left>
            <TouchableOpacity
              style={styles.backAr}
              onPress={() => this.props.navigation.goBack()}>
              <FontAwesomeIcon style={{color: 'white'}} icon={faArrowLeft} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={styles.title}>Profile</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <View style={styles.head}>
            <Image style={styles.image} source={{uri: this.state.image}} />
            <Text style={styles.nameDat}>{this.state.name}</Text>
          </View>

          <Text style={styles.adres}>Alamat :{this.state.address}</Text>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: '#00161f',
  },
  head: {
    backgroundColor: '#002736',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
  head2: {
    backgroundColor: '#00161f',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
  image: {
    width: '35%',
    height: '57%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
  },
  backAr: {
    paddingLeft: 10,
  },
  title: {
    fontSize: 19,
  },
  nameDat: {
    fontSize: 17,
    color: 'white',
  },
  adres: {
    marginVertical: 20,
    paddingHorizontal: 20,
    color: '#e5e5e5',
  },
  btn: {
    marginHorizontal: 100,
    borderRadius: 15,
  },
});

export default ProfileFriends;
