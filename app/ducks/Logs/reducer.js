module.exports = (state = [], action) => {
  switch (action.type) {

    case 'ADD_LOG':
      return [
        action.log,
        ...state,
      ];

    case 'UPDATE_LOG':
      return state.map(log => {
        if (log.id === action.log.id) return action.log;
        return log;
      });

    case 'REMOVE_LOG':
      return state.filter(log => (log.id !== action.id ));

    default:
      return state;
  }
};
