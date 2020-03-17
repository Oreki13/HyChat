import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
  Image,
  PermissionsAndroid,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import {Header, Left, Right, Body, Title} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faCamera} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import firebase from '../firebase/index';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      address: '',
      name: '',
      status: '',
      image: '',
      id: '',
    };

    geolocation.getCurrentPosition(info => {
      this.setState({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      });
    });
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    let pos = {
      lat: this.state.latitude,
      lng: this.state.longitude,
    };

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
        });
      });
    Geocoder.geocodePosition(pos).then(res => {
      this.setState({
        address: res[0].formattedAddress,
      });
    });
  };
  Logout = async () => {
    const userId = await AsyncStorage.getItem('uid');
    firebase
      .database()
      .ref(`/user/${userId}`)
      .update({status: 'offline'});
    let keys = ['uid', 'name', 'image'];
    await AsyncStorage.multiRemove(keys, error => {
      this.props.navigation.navigate('Login');
    });
  };

  imagePic = async () => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Image',

      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ])
      .then(result => {
        if (
          result['android.permission.CAMERA'] === 'granted' &&
          result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          ImagePicker.showImagePicker(options, response => {
            let uploadBob = null;
            const imageRef = firebase.storage().ref(`profile/${this.state.id}`);
            fs.readFile(response.path, 'base64')
              .then(data => {
                return Blob.build(data, {type: `${response.mime};BASE64`});
              })
              .then(blob => {
                uploadBob = blob;
                return imageRef.put(blob, {contentType: `${response.mime}`});
              })
              .then(() => {
                uploadBob.close();
                return imageRef.getDownloadURL();
              })
              .then(async url => {
                firebase
                  .database()
                  .ref(`user/${this.state.id}`)
                  .update({image: url});
                this.setState({image: url}).catch(err => console.log(err));
              });
          });
        } else if (
          result['android.permission.CAMERA'] === 'denied' &&
          result['android.permission.READ_EXTERNAL_STORAGE'] === 'denied' &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
        ) {
          ToastAndroid.show(
            'Allow Permission to Continue',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      })
      .catch(err => console.log(err));
  };

  render() {
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
            <View
              style={{
                width: 100,
                // backgroundColor: 'red',
                marginLeft: 20,
                height: Dimensions.get('screen').height - 550,
                width: Dimensions.get('screen').width - 290,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image style={styles.image} source={{uri: this.state.image}} />
              <View
                style={{
                  top: 40,
                  left: -30,
                  backgroundColor: '#002736',
                  borderRadius: 50,
                  // borderWidth: 1,
                  // borderColor: 'white',
                  padding: 5,
                }}>
                <TouchableOpacity onPress={this.imagePic}>
                  <FontAwesomeIcon icon={faCamera} size="20" color="#e5e5e5" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.nameDat}>{this.state.name}</Text>
            </View>
          </View>

          {/* <Text style={styles.adres}>Alamat :{this.state.address}</Text> */}
          <View style={styles.box}>
            <View style={styles.set}>
              <Text
                style={{
                  fontSize: 15,
                  color: '#e5e5e5',
                }}>
                Setting
              </Text>
            </View>
            {/* <View style={styles.btn}>
              <TouchableOpacity title="Upload Image" onPress={this.imagePic}>
                <Text style={{color: '#e5e5e5'}}>Upload</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.btnLog}>
              <TouchableOpacity title="Logout" onPress={this.Logout}>
                <Text style={{color: '#c4c4c4', fontSize: 12}}>LogOut</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: '#00161f',
  },
  head: {
    backgroundColor: '#002736',
    height: 200,
    // justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  head2: {
    backgroundColor: '#4287f5',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width,
  },
  image: {
    width: '90%',
    height: '59%',
    borderRadius: 54,
    // borderWidth: 1,
    // borderColor: 'white',
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
    // backgroundColor: 'blue',
  },
  box: {
    marginTop: 30,
    backgroundColor: '#0f222e',
    borderRadius: 7,
  },
  set: {
    borderBottomWidth: 1,
    borderColor: '#4c5459',
    paddingBottom: 5,
    paddingTop: 5,

    paddingLeft: 10,
  },
  adres: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: '#193445',
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: '#0f222e',
    borderRadius: 5,
  },
  btnLog: {
    backgroundColor: '#193445',
    paddingVertical: 10,
    marginBottom: 15,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: '#0f222e',
  },
});

export default Profile;
