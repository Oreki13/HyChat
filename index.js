/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import 'react-native-gesture-handler';
import {name as appName} from './app.json';

import React, {Component} from 'react';
import Splash from './src/splash/index';

class Main extends Component {
  constructor(properties) {
    super(properties);
    this.state = {currentScreen: 'Splash'};
    setTimeout(() => {
      this.setState({currentScreen: 'App'});
    }, 1300);
  }
  render() {
    const {currentScreen} = this.state;
    let mainScreen = currentScreen == 'Splash' ? <Splash /> : <App />;
    return mainScreen;
  }
}

export default Main;

AppRegistry.registerComponent(appName, () => Main);
