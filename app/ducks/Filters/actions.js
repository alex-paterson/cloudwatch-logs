exports.addFilter = (filter) => {
  return {
    type: 'ADD_FILTER',
    filter
  };
};
exports.removeFilter = (id) => {
  return {
    type: 'REMOVE_FILTER',
    id
  };
};
