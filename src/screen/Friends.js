import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import {Header, Left, Right, Body, Title, List, ListItem} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../firebase/index';

class Friends extends Component {
  state = {
    users: [],
    uid: [],
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
  };

  render() {
    return (
      <Fragment>
        <Header style={{backgroundColor: '#4287f5'}}>
          <Left>
            <TouchableOpacity
              style={styles.IconAr}
              onPress={() => this.props.navigation.navigate('Home')}>
              <FontAwesomeIcon size={15} color="white" icon={faArrowLeft} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title>Friends List</Title>
          </Body>
          <Right />
        </Header>
        <View>
          <FlatList
            data={this.state.users}
            numColumns={1}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.props.navigation.navigate('Chat', item)}>
                  <View style={styles.item}>
                    <Image
                      style={styles.image}
                      source={{uri: `${item.image}`}}
                    />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.textName}>{item.name}</Text>
                    <Text style={styles.textStatus}>{item.status}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  IconAr: {paddingLeft: 5},
  button: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
    margin: 4,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  content: {
    flex: 5,
    paddingLeft: 5,
  },
  textName: {
    fontSize: 18,
    color: '#1c1c1c',
  },
  textStatus: {
    fontSize: 14,
    color: '#1c1c1c',
  },
});

export default Friends;
