import { combineReducers, createStore } from 'redux';
import authReducer from './reducers';

const rootReducer = combineReducers({
  auth: authReducer,
});

// Hàm lưu trạng thái vào localStorage
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.warn(e);
  }
}

// Hàm tải trạng thái từ localStorage
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();

const store = createStore(
  rootReducer,
  persistedState,
  // applyMiddleware(...middleware) // nếu có
);

store.subscribe(() => saveToLocalStorage(store.getState()));


export default store;