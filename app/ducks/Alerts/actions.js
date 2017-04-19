exports.addAlert = (text, style) => {
  return {
    type: 'ADD_ALERT',
    text,
    style
  };
};

exports.removeAlert = (id) => {
  return {
    type: 'REMOVE_ALERT',
    id
  };
};
