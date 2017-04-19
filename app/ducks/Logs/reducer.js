module.exports = (state = [], action) => {
  switch (action.type) {

    case 'ADD_LOG':
      return [
        action.log,
        ...state,
      ];

    case 'REMOVE_LOG':
      return state.filter((log) => (log.id !== action.id ));

    default:
      return state;
  }
};
