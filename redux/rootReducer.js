import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/auth.reducer';
import {
  detailFormReducer,
  addItemsFormReducer,
  searchPopupReducer,
} from './detail-form/detail-form.reducer';
import messageDialogReducer from './message-dialog/message-dialog.reducer';
import rejectDialogReducer from './reject-dialog/reject-dialog.reducer';
import pageHeaderReducer from './page-header/page-header.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authStore'],
  blacklist: [
    'dialogStore',
    'detailFormStore',
    'addItemsFormStore',
    'searchPopupStore',
  ],
};

const rootReducer = combineReducers({
  authStore: authReducer,
  messageDialogStore: messageDialogReducer,
  rejectDialogStore: rejectDialogReducer,
  detailFormStore: detailFormReducer,
  addItemsFormStore: addItemsFormReducer,
  searchPopupStore: searchPopupReducer,
  pageHeaderStore: pageHeaderReducer,
});

export default persistReducer(persistConfig, rootReducer);
