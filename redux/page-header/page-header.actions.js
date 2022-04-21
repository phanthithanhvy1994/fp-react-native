import { PageHeaderAction } from './page-header.types';
import store from '../store';

export const setSubstractionValue = value => {
  store.dispatch({
    type: PageHeaderAction.SET_SUBSTRACTION_VALUE,
    payload: value,
  });
};
