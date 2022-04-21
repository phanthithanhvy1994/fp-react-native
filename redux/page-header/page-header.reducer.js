import { INITIAL_STATE } from '../initialState';
import { PageHeaderAction } from './page-header.types';

const pageHeaderReducer = (state = INITIAL_STATE.pageHeaderStore, action) => {
  switch (action.type) {
    case PageHeaderAction.SET_SUBSTRACTION_VALUE:
      return {
        ...state,
        substractionValue: action.payload,
      };
    default:
      return state;
  }
};

export default pageHeaderReducer;
