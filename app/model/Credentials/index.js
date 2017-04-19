import {setItem, getItem} from 'react-native-sensitive-info';

exports.setCredentialsForID = function(id, accessKeyID, secretAccessKey) {
  setItem(`${id}accessKeyID`, accessKeyID, {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain'});
  setItem(`${id}secretAccessKey`, secretAccessKey, {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: 'myKeychain'});
};

exports.getCredentialsForID = function(id, callback) {
  getItem(`${id}secretAccessKey`,{
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain'}).then((secretAccessKey) => {
    if (!secretAccessKey) return callback(new Error('Secret key missing.'));

    getItem(`${id}accessKeyID`,{
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain'}).then((accessKeyID) => {
      if (!accessKeyID) return callback(new Error('Access key ID missing.'));

      return callback(null, accessKeyID, secretAccessKey);
    });
  });
};
