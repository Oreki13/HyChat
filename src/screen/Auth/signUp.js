import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import firebase from '../../firebase/index';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      isLoading: false,
    };
  }
  register = async () => {
    this.setState({isLoading: true});
    if (this.state.email.length < 4) {
      Alert.alert('Email Invalid');
    } else if (this.state.password.length < 1) {
      Alert.alert('please input password more than 2');
    } else if (this.state.name.length < 3) {
      Alert.alert('please input Name more than 3');
    } else {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(({user}) => {
          this.setState({isLoading: false});
          var userf = firebase.auth().currentUser;
          userf.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.image,
          });
          firebase
            .database()
            .ref('user/' + user.uid)
            .set({
              name: this.state.name,
              image:
                'https://www.shareicon.net/data/2016/09/01/822711_user_512x512.png',
              id: user.uid,
              status: 'offline',
            });
        });
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <View style={styles.form}>
        <View style={styles.brand}>
          <Image style={styles.img} source={require('../../assets/logo.png')} />
          <Text style={styles.texBrand}>Hy Chat</Text>
        </View>

        <View style={styles.input}>
          <Text style={styles.tex}>Name</Text>
          <TextInput
            style={styles.box}
            onChangeText={text => this.setState({name: text})}
          />
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
        <Button title="Sign Up" color="purple" onPress={this.register} />
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
    width: 60,
    margin: 20,
  },
  texBrand: {
    textAlign: 'center',
    width: 100,
    fontSize: 19,
    color: 'white',
  },
});

export default SignUp;
