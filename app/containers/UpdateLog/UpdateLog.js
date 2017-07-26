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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Navbar from '../../components/Navbar';
import {updateLog} from '../../ducks/Logs/actions';

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

class UpdateLog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applicationLog: props.log.log,
      applicationStream: props.log.stream,
      region: props.log.region
    };
  }

  onBack() {
    this.props.navigator.pop();
  }

  confirm() {
    var {dispatch, navigator, log} = this.props;
    var {applicationLog, applicationStream, region} = this.state;
    if (applicationLog && applicationStream && region) {
      dispatch(updateLog({
        id: log.id,
        log: applicationLog,
        stream: applicationStream,
        region: region,
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

        <KeyboardAwareScrollView extraScrollHeight={100} style={{backgroundColor: '#fafafa', flex: 1}}>
          <Text style={styles.label}>LOG GROUP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='My-Application-Log'
              style={styles.input}
              onChangeText={(applicationLog) => this.setState({applicationLog})}
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.applicationLog}/>
          </View>

          <Text style={styles.label}>LOG STREAM</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='production'
              style={styles.input}
              onChangeText={(applicationStream) => this.setState({applicationStream})}
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.applicationStream}/>
          </View>

          <Text style={styles.label}>REGION</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='us-west-2'
              style={styles.input}
              onChangeText={(region) => this.setState({region})}
              autoCapitalize='none'
              autoCorrect={false}
              value={this.state.region}/>
          </View>

          <TouchableOpacity style={styles.button} onPress={this.confirm.bind(this)}>
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default connect()(UpdateLog);
