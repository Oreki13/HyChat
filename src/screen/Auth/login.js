import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {Spinner, Button} from 'native-base';
import firebase from '../../firebase/index';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
  }
  onPressLogin = async () => {
    this.setState({isLoading: true});
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async result => {
        await firebase
          .database()
          .ref(`/user/${result.user.uid}`)
          .update({status: 'online'});

        await firebase
          .database()
          .ref(`user/${result.user.uid}`)
          .once('value')
          .then(data => {
            this.setState({isLoading: false});
            AsyncStorage.setItem('uid', data.val().id);
            AsyncStorage.setItem('name', data.val().name);
            AsyncStorage.setItem('image', data.val().image);
            AsyncStorage.getItem('uid', (error, result) => {
              if (result) {
                this.setState({
                  email: '',
                  password: '',
                });
                this.props.navigation.navigate('Home', {name: 'asdasd'});
                ToastAndroid.show(
                  'Login Success',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              }
            });
          });
      })
      .catch(async err => {
        ToastAndroid.show(
          'User Atau Password Salah',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        this.setState({
          isLoading: false,
        });
      });
  };
  render() {
    return (
      <View style={styles.form}>
        <View style={styles.brand}>
          <Image style={styles.img} source={require('../../assets/logo.png')} />
          <Text style={styles.texBrand}>Hy Chat</Text>
        </View>

        <View style={styles.input}>
          <Text style={styles.tex}>Email</Text>
          <TextInput
            style={styles.box}
            onChangeText={text => this.setState({email: text})}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.tex}>Password</Text>
          <TextInput
            style={styles.box}
            secureTextEntry
            onChangeText={text => this.setState({password: text})}
          />
        </View>
        <Button style={styles.btn1} onPress={this.onPressLogin}>
          {this.state.isLoading ? (
            <Spinner color="white" />
          ) : (
            <Text style={{color: 'white'}}>Login</Text>
          )}
        </Button>
        <Text style={styles.texBtn}>Don't Have Account?</Text>
        <Button
          style={styles.btn2}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={{color: 'white'}}>SignUp</Text>
        </Button>
        {/* <Spinner color="red" /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44989c',
  },
  box: {
    borderColor: 'black',
    borderWidth: 1,
    width: '50%',
    height: 30,
    padding: 0,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
  },
  tex: {
    marginRight: 10,
    width: 70,
    color: 'white',
  },
  img: {
    width: 100,
    height: 100,
  },
  brand: {
    marginBottom: 50,
    width: 100,
    margin: 20,
  },
  texBrand: {
    textAlign: 'center',
    width: 100,
    fontSize: 19,
    color: 'white',
  },
  texBtn: {
    marginVertical: 10,
  },
  btn1: {
    paddingHorizontal: 30,
    height: 35,
    backgroundColor: '#8a3ab5',
  },
  btn2: {
    paddingHorizontal: 20,
    height: 35,
    backgroundColor: '#8a3ab5',
  },
});

export default Login;
