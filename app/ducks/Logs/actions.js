exports.addLog = (log) => {
  return {
    type: 'ADD_LOG',
    log
  };
};

exports.removeLog = (id) => {
  return {
    type: 'REMOVE_LOG',
    id
  };
};
