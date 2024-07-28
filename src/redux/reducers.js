import { LOGIN_SUCCESS, LOGOUT, UPDATE_DATA_SUCCESS } from './actions';

const initialState = {
  userData: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload,
      };
    case LOGOUT: // Handle logout action
      return {
        ...state,
        userData: null, // Reset userData to null when logging out
      };
    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;