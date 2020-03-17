import React from 'react';

import {Button, View, Text} from 'react-native';

import Home from '../screen/Home';
import styleDrawer from './styleDrawer';
import Chat from '../screen/chat';
import Maps from '../screen/Maps';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Friends from '../screen/Friends';
import {faUserFriends} from '@fortawesome/free-solid-svg-icons';
import Login from '../screen/Auth/login';
import SignUp from '../screen/Auth/signUp';
import Auth from '../screen/Auth/Auth';
import Profile from '../screen/profile';
import ProfileFriends from '../screen/ProfileFriends';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {AuthParamList} from './AuthParamList';
import {DrawerParamList, SideBarList} from './DrawerParamList';
import {HomeParamList} from './HomeParamList';

interface Routes {}
interface Drawer {}
interface HomeStack {}
interface SideBar {}

const Stack = createStackNavigator<AuthParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const StackHome = createStackNavigator<HomeParamList>();
const SideBar = createStackNavigator<SideBarList>();

export const HomeStack: React.FC<HomeStack> = ({}) => {
  return (
    <StackHome.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => null,
      }}>
      <StackHome.Screen name="Home" component={Home} />
      <StackHome.Screen name="Chat" component={Chat} />
      <StackHome.Screen name="ProfileFriends" component={ProfileFriends} />
    </StackHome.Navigator>
  );
};

export const PageDrawer: React.FC<Drawer> = ({}) => {
  return (
    <Drawer.Navigator
      initialRouteName="HomePage"
      drawerPosition="left"
      drawerType="front">
      <Drawer.Screen name="HomePage" component={HomeStack} />
      <Drawer.Screen name="MapsPage" component={Maps} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

export const Auths: React.FC<Routes> = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          header: () => null,
        }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="HomePage" component={PageDrawer} />

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
