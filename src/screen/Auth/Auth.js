import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
  StatusBar,
} from 'react-native';

export default class Loading extends React.Component {
  state = {
    uid: null,
    isLoading: true,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    await AsyncStorage.getItem('uid').then(value => {
      this.setState({
        uid: value,
        isLoading: false,
      });
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#002736" />
        {this.state.isLoading == false ? (
          this.state.uid == null ? (
            this.props.navigation.navigate('Login')
          ) : (
            this.props.navigation.navigate('HomePage')
          )
        ) : (
          <ActivityIndicator color={'white'} size={'large'} />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
});
