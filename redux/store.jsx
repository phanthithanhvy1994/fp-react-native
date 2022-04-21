import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import messageDialogReducer from './message-dialog/message-dialog.reducer';
import rejectDialogReducer from './reject-dialog/reject-dialog.reducer';
import authReducer from './auth/auth.reducer';

import { INITIAL_STATE as initialState } from './initialState';
import {
  detailFormReducer,
  addItemsFormReducer,
  searchPopupReducer,
} from './detail-form/detail-form.reducer';

import pageHeaderReducer from './page-header/page-header.reducer';

function createReducer() {
  return combineReducers({
    messageDialogStore: messageDialogReducer,
    rejectDialogStore: rejectDialogReducer,
    authStore: authReducer,
    detailFormStore: detailFormReducer,
    addItemsFormStore: addItemsFormReducer,
    searchPopupStore: searchPopupReducer,
    pageHeaderStore: pageHeaderReducer,
  });
}

function configStore(state) {
  const store = createStore(createReducer(), state, applyMiddleware(thunk));
  return store;
}

const store = configStore(initialState);
export default store;
