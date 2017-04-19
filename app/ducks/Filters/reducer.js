module.exports = (state = [], action) => {
  switch (action.type) {

    case 'ADD_FILTER':
      return [
        action.filter,
        ...state,
      ];

    case 'REMOVE_FILTER':
      return state.filter((filter) => (filter.id !== filter.id ));

    default:
      return state;
  }
};
