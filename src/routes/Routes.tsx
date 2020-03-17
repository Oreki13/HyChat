import React from 'react';

import {Button, View, Text} from 'react-native';
// import {createAppContainer, createSwitchNavigator} from 'react-navigation';
// import {createStackNavigator} from 'react-navigation-stack';
// import {createDrawerNavigator} from 'react-navigation-drawer';
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

// const AuthPage = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Auth"
//       screenOptions={{
//         header: () => null,
//       }}>
//       <Stack.Screen name="Auth" component={Auth} />
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="SignUp" component={SignUp} />
//     </Stack.Navigator>
//   );
// };
// export const HomePage = () => {
//   console.log('asd');

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         header: () => null,
//       }}>
//       <Stack.Screen name="Home" component={() => <Home />} />
//       {/* <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="Chat" component={Chat} />
//       <Stack.Screen name="Maps" component={Maps} />
//       <Stack.Screen name="ProfileFriends" component={ProfileFriends} /> */}
//     </Stack.Navigator>
//   );
// };

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
// export const SideBar: React.FC<SideBar> = ({}) => {
//   return (
//     <SideBar.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         header: () => null,
//       }}>
//       <SideBar.Screen name="Home" component={Home} />
//       <SideBar.Screen name="Profile" component={Profile} />
//       {/* <SideBar.Screen name="ProfileFriends" component={ProfileFriends} /> */}
//     </SideBar.Navigator>
//   );
// };

export const PageDrawer: React.FC<Drawer> = ({}) => {
  return (
    <Drawer.Navigator
      initialRouteName="HomePage"
      drawerPosition="left"
      // drawerContent={styleDrawer}

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

// const AuthStack = createStackNavigator(
//   {
//     Login,
//     SignUp,
//   },
//   {
//     initialRouteName: 'Login',
//     headerMode: 'none',
//   },
// );

// const HomeStack = createStackNavigator(
//   {
//     Home,
//     Profile,
//     Chat,
//     Maps,
//     ProfileFriends,
//   },
//   {
//     initialRouteName: 'Home',

//     headerMode: 'none',
//   },
// );

// const stackDrawer = createDrawerNavigator(
//   {
//     HomeStack,
//   },
//   {
//     initialRouteName: 'HomeStack',
//     drawerPosition: 'left',
//     contentComponent: styleDrawer,
//     drawerType: 'front',
//   },
// );

// const Router = createSwitchNavigator(
//   {
//     AuthStack,
//     stackDrawer,
//     Auth,
//   },
//   {
//     initialRouteName: 'Auth',
//     headerMode: 'none',
//   },
// );

// function Navigation() {
//   return (
//     <NavigationContainer>
//       <PageDrawer />
//     </NavigationContainer>
//   );
// }

// export default Navigation;
