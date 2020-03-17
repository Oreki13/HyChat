import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  MessageText,
} from 'react-native-gifted-chat';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {withNavigation} from 'react-navigation';
import {Header, Left, Right, Body, Title, Spinner} from 'native-base';
import firebase from '../firebase/index';
import AsyncStorage from '@react-native-community/async-storage';

class Chat extends Component {
  state = {
    uid: this.props.route.params.id,
    name: this.props.route.params.name,
    image: this.props.route.params.image,
    status: this.props.route.params.status,
    massages: [],
    text: '',
    isLoading: true,
  };

  componentDidMount = async () => {
    console.log(this.props);

    const myid = await AsyncStorage.getItem('uid');
    const myname = await AsyncStorage.getItem('name');
    const avatar = await AsyncStorage.getItem('image');
    this.setState({myid, myname, avatar});
    firebase
      .database()
      .ref('messages')
      .child(this.state.myid)
      .child(this.state.uid)
      .on('child_added', val => {
        this.setState(previousState => ({
          massages: GiftedChat.append(previousState.massages, val.val()),
        }));
      });
    this.setState({isLoading: false});
  };

  sendMessage = async () => {
    if (this.state.text.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.myid)
        .child(this.state.uid)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.text,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.myid,
          name: this.state.myname,
          avatar: this.state.avatar,
        },
      };
      updates[
        `messages/${this.state.myid}/${this.state.uid}/${msgId}`
      ] = message;
      updates[
        `messages/${this.state.uid}/${this.state.myid}/${msgId}`
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({text: ''});
    }
  };

  render() {
    return (
      <>
        <Header style={{backgroundColor: '#002736'}}>
          <StatusBar backgroundColor="#002736" barStyle="default" />
          <Left>
            <TouchableOpacity
              style={styles.backAr}
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}>
              <FontAwesomeIcon style={styles.iconAr} icon={faArrowLeft} />
            </TouchableOpacity>
          </Left>
          <Body>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('ProfileFriends', {
                  idNya: this.state.uid,
                })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    marginRight: 10,
                  }}
                  source={{uri: this.state.image}}
                />
                <Title style={styles.title}>{this.state.name}</Title>
              </View>
            </TouchableOpacity>
          </Body>
          <Right />
        </Header>
        {this.state.isLoading ? (
          <View style={styles.load}>
            <Spinner color="blue" />
          </View>
        ) : (
          <View style={{backgroundColor: '#00161f', flex: 1}}>
            <GiftedChat
              messages={this.state.massages}
              onSend={this.sendMessage}
              showAvatarForEveryMessage={true}
              alwaysShowSend={true}
              renderBubble={pod => {
                return (
                  <Bubble
                    {...pod}
                    textStyle={{
                      right: {
                        color: '#e5e5e5',
                      },
                      left: {
                        color: 'white',
                      },
                    }}
                    wrapperStyle={{
                      left: {
                        backgroundColor: '#032e40',
                      },
                      right: {
                        backgroundColor: '#2e6075',
                      },
                    }}
                  />
                );
              }}
              user={{
                _id: this.state.myid,
                name: this.state.myname,
                avatar: this.state.avatar,
              }}
              renderInputToolbar={tur => {
                return (
                  <InputToolbar
                    {...tur}
                    containerStyle={{
                      backgroundColor: '#000',
                      color: '#fff',
                      borderTopWidth: 0,
                    }}
                    textInputStyle={{
                      color: 'white',
                    }}
                  />
                );
              }}
              renderSend={run => {
                return (
                  <Send {...run}>
                    <View style={{marginRight: 15, marginBottom: 15}}>
                      <FontAwesomeIcon
                        size={18}
                        icon={faPaperPlane}
                        color="#e5e5e5"
                      />
                    </View>
                  </Send>
                );
              }}
              onInputTextChanged={value => this.setState({text: value})}
            />
          </View>
        )}
      </>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontSize: 19,
  },
  backAr: {
    paddingLeft: 10,
  },
  iconAr: {
    color: 'white',
  },
  load: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#00161f',
    flex: 1,
  },
});

export default Chat;
