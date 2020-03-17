import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

class Splash extends Component {
  render() {
    return (
      <View style={styles.containers}>
        <StatusBar backgroundColor="#4287f5" barStyle="light-content" />
        <View style={styles.imageContainer}>
          <Image source={require('../assets/logo.png')} style={styles.image} />
          <Text>Hy Chat</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: '#5dc4c9',
  },
  imageContainer: {
    // width: 300,
    // height: 300,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Splash;
