export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_DATA_SUCCESS = 'UPDATE_DATA_SUCCESS';

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT, // Action cho việc đăng xuất
});

export const updateDataSuccess = (updatedData) => ({
  type: UPDATE_DATA_SUCCESS,
  payload: updatedData,
});