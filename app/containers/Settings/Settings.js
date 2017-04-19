import React, { Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Navbar from '../../components/Navbar';

var styles = StyleSheet.create({
  label: {
    margin: 8,
    marginTop: 20,
    fontSize: 14
  },
  inputContainer: {
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderRightColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    padding: 8,
    fontSize: 16
  },
  button: {
    marginTop: 20,
    borderColor: '#dbdddc',
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#efaf27',
    borderRightColor: '#efaf27',
    padding: 16,
    backgroundColor: '#efaf27',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessKeyID: undefined,
      secretAccessKey: undefined
    };
  }

  onBack() {
    this.props.navigator.pop();
  }

  confirm() {
    var {accessKeyID, secretAccessKey} = this.state;
    if (accessKeyID && secretAccessKey) {
      Keychain.setGenericPassword(accessKeyID, secretAccessKey);
      this.props.navigator.pop();
    }
  }

  render() {
    return (
      <View style={{backgroundColor: '#fafafa', flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title='Settings'
          rightButtonHidden={true}
          onLeftButtonPress={this.onBack.bind(this)}
          // onRightButtonPress={this.confirm.bind(this)}
          leftIconName='chevron-left'
          // rightIconName='check'
        />

        <View style={{backgroundColor: '#fafafa', flex: 1}}>
          <Text style={styles.label}>ACCESS KEY ID</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='XXXXX6L62MA3O4PXXXXX'
              style={styles.input}
              onChangeText={(accessKeyID) => this.setState({accessKeyID})}
              autoCapitalize='none'
              value={this.state.accessKeyID}/>
          </View>

          <Text style={styles.label}>SECRET ACCESS KEY</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='XXXXXaASzasdTZf12xaAasdd9NQu6Nq4zZiXXXXX'
              style={styles.input}
              onChangeText={(secretAccessKey) => this.setState({secretAccessKey})}
              autoCapitalize='none'
              value={this.state.secretAccessKey}/>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.confirm.bind(this)}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
