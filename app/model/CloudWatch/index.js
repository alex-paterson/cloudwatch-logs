import AWSSignature from 'react-native-aws-signature';
import axios from 'axios';

import Credentials from '../Credentials';


export class LogStream {

  constructor(config, activeFilter, callback) {
    this.logGroupName = config.log;
    this.logStreamName = config.stream;
    this.region = config.region;
    if (activeFilter) this.filter = activeFilter.filterString;

    Credentials.getCredentialsForID(config.id, (err, accessKeyID, secretAccessKey) => {
      if (err) return callback(err);

      if (!accessKeyID || !secretAccessKey) return callback(new Error('Credentials missing!'));
      this.credentials = {
        AccessKeyId: accessKeyID,
        SecretKey: secretAccessKey
      };
      callback();
    });

  }

  performRequest(body, callback) {
    var awsSignature = new AWSSignature();
    var date = awsSignature.formatDateTime(new Date(Date.now()).toISOString());

    body = JSON.stringify(body, null, 0);

    var host = `logs.${this.region}.amazonaws.com`;
    var headers = {
      Host: host,
      'X-Amz-Date': date,
      'region': 'ap-southeast-2',
      'Content-Length': body.length,
      Accept: 'application/json',
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'Logs_20140328.GetLogEvents',
    };
    var options = {
      path: '/',
      method: 'post',
      service: 'logs',
      headers,
      region: this.region,
      body,
      credentials: this.credentials
    };

    awsSignature.setParams(options);
    var authorization = awsSignature.getAuthorizationHeader();

    var headersWithAuth = headers;
    headersWithAuth['Authorization'] = authorization['Authorization'];

    axios.post(`https://${host}/`, body, {headers: headersWithAuth}).then(response => {
      callback(null, response);
    }).catch(err => {
      callback(err);
    });

  }

  handleResponse(response, callback) {
    var events = response.data.events.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    callback(null, events);
  }

  getFirstLogs(callback) {
    this.performRequest({
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      limit: 15,
      filterPattern: this.filter,
      startFromHead: false
    }, (err, response) => {
      try {
        if (err) return callback(new Error(err.response.data.message));
      } catch (err) {}

      if (err) return callback(err);
      this.nextBackwardToken = response.data.nextBackwardToken;
      this.nextForwardToken = response.data.nextForwardToken;
      this.handleResponse(response, callback);
    });
  }

  getNextLogs(callback) {
    if (this.nextForwardToken) {
      var token = this.nextForwardToken;
      this.nextForwardToken = undefined;
      this.performRequest({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        limit: 15,
        startFromHead: false,
        nextToken: token
      }, (err, response) => {
        if (err) return callback(err);
        // this.nextBackwardToken = response.data.nextBackwardToken;
        this.nextForwardToken = response.data.nextForwardToken;
        this.handleResponse(response, callback);
      });
    }
  }

  getLastLogs(callback) {
    if (this.nextBackwardToken) {
      var token = this.nextBackwardToken;
      this.nextBackwardToken = undefined;
      this.performRequest({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        limit: 15,
        startFromHead: false,
        nextToken: token
      }, (err, response) => {
        if (err) return callback(err);
        this.nextBackwardToken = response.data.nextBackwardToken;
        // this.nextForwardToken = response.data.nextForwardToken;
        this.handleResponse(response, callback);
      });
    }
  }

}
