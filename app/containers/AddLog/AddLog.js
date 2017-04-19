import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import uuid from 'uuid';

import Navbar from '../../components/Navbar';
import Credentials from '../../model/Credentials';
import {addLog} from '../../ducks/Logs/actions';

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

class SelectLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationLog: undefined,
      applicationStream: undefined,
      region: undefined,
      accessKeyID: undefined,
      secretAccessKey: undefined
    };
  }

  onBack() {
    this.props.navigator.pop();
  }

  confirm() {
    var {dispatch, navigator} = this.props;
    var {applicationLog, applicationStream, region, accessKeyID, secretAccessKey} = this.state;
    if (applicationLog && applicationStream && region && accessKeyID && secretAccessKey) {
      var id = uuid.v4();

      Credentials.setCredentialsForID(id, accessKeyID, secretAccessKey);

      dispatch(addLog({
        log: applicationLog,
        stream: applicationStream,
        region: region,
        id: id
      }));
      navigator.pop();
    }
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <StatusBar barStyle='light-content'/>
        <Navbar
          title='Add Log'
          rightButtonHidden={true}
          onLeftButtonPress={this.onBack.bind(this)}
          leftIconName='chevron-left'/>

        <View style={{backgroundColor: '#fafafa', flex: 1}}>
          <Text style={styles.label}>LOG GROUP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='My-Application-Log'
              style={styles.input}
              onChangeText={(applicationLog) => this.setState({applicationLog})}
              autoCapitalize='none'
              value={this.state.applicationLog}/>
          </View>

          <Text style={styles.label}>LOG STREAM</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='production'
              style={styles.input}
              onChangeText={(applicationStream) => this.setState({applicationStream})}
              autoCapitalize='none'
              value={this.state.applicationStream}/>
          </View>

          <Text style={styles.label}>REGION</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='us-west-2'
              style={styles.input}
              onChangeText={(region) => this.setState({region})}
              autoCapitalize='none'
              value={this.state.region}/>
          </View>


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

export default connect()(SelectLog);
