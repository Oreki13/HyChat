import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import {Header, Left, Right, Fab, Title, Body, Spinner} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBars,
  faCircle,
  faAddressBook,
} from '@fortawesome/free-solid-svg-icons';
import geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../firebase/index';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      data: [],
      naem: 0,
      newFilter: [],
      idUser: '',
      isLoading: true,
    };
    this.getLocation();
    this.updateLocation();
  }

  getLocation = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(() => {
      geolocation.getCurrentPosition(info => {
        console.log(info);

        this.setState({
          latitude: info.coords.latitude,
          longtitude: info.coords.longitude,
        });
      });
    });
  };

  updateLocation = async () => {
    AsyncStorage.getItem('uid', (error, result) => {
      if (result) {
        if (this.state.latitude) {
          firebase
            .database()
            .ref(`user/${result}`)
            .update({
              latitude: this.state.latitude,
              longtitude: this.state.longtitude,
            });
        }
      }
    });
  };

  componentDidMount = async () => {
    await AsyncStorage.getItem('uid').then(result => {
      if (result) {
        this.setState({uid: result});
      }
    });
    firebase
      .database()
      .ref('user')
      .on('child_added', data => {
        let person = data.val();
        person.id = data.key;
        if (person.id !== this.state.uid) {
          this.setState(prevData => {
            return {
              users: [...prevData.users, person],
            };
          });
        }
      });
    this.setState({isLoading: false});
    // const uid = await AsyncStorage.getItem('uid');
    // this.setState({idUser: uid});

    // firebase
    //   .database()
    //   .ref(`messages/${uid}`)
    //   .once('child_added', result => {
    //     let person = result.val();

    //     person.id = result.key;
    //     this.state.chat.push({
    //       id: person.id,
    //     });
    //     this.setState({chat: this.state.chat});
    //   });
    // firebase
    //   .database()
    //   .ref('user/')
    //   .once('value', result => {
    //     let data = result.val();

    //     if (data !== null) {
    //       let users = Object.values(data);
    //       this.setState({
    //         users,
    //       });
    //     }
    //   });
    // const {users} = this.state;

    // let datas = users.filter(data => data.id !== uid);
    // this.setState({newFilter: datas, isLoading: false});
  };

  // filterMasage = async () => {
  //   console.log('Ok');

  //   const {users} = this.state;
  //   await AsyncStorage.getItem('uid').then(result => {
  //     console.log(result);

  //     let datas = users.filter(data => data.id !== result);
  //     this.setState({newFilter: datas});
  //   });
  // };

  render() {
    // const users = this.state.users;

    // const data2 = users.filter(data => data.id !== this.state.idUser);

    return (
      <Fragment>
        <Header style={{backgroundColor: '#002736'}}>
          <StatusBar backgroundColor="#002736" barStyle="default" />
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.toggleDrawer()}>
              <FontAwesomeIcon size={17} color="white" icon={faBars} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Hy Chat</Title>
          </Body>
          <Right />
        </Header>
        <View style={{backgroundColor: '#00161f', flex: 1}}>
          {this.state.isLoading ? (
            <View style={styles.load}>
              <Spinner color="blue" />
            </View>
          ) : (
            <FlatList
              data={this.state.users}
              numColumns={1}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      this.props.navigation.navigate('Chat', item)
                    }>
                    <View style={styles.item}>
                      <Image
                        style={styles.image}
                        source={{uri: `${item.image}`}}
                      />
                      <View>
                        <FontAwesomeIcon
                          size={15}
                          color="blue"
                          icon={faCircle}
                          style={styles.stat}
                        />
                      </View>
                    </View>
                    <View style={styles.content}>
                      <View>
                        <Text style={styles.textName}>{item.name}</Text>
                        <Text style={styles.textChat}>Text of Chat</Text>
                        {/* <Text style={styles.textStatus}>{item.status}</Text> */}
                      </View>
                      <View>
                        <Text style={styles.textTime}>15:00</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
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
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  stat: {
    marginLeft: -15,
    marginTop: 33,
  },
  logoSplash: {
    width: 200,
    height: 200,
  },
  title: {
    color: '#FFF',
    opacity: 0.8,
    fontSize: 18,
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,

    margin: 4,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  content: {
    flex: 5,
    paddingLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    borderColor: '#1b3a47',
  },
  textTime: {
    color: '#d5e1e6',
  },
  textName: {
    marginTop: 0,
    fontSize: 18,
    color: '#fff',
    fontWeight: '400',
  },
  textChat: {
    fontSize: 13,
    color: '#d5e1e6',
    fontWeight: '400',
    paddingTop: 3,
  },
  textStatus: {
    fontSize: 14,
    color: '#1c1c1c',
  },
  load: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
});

export default Home;
