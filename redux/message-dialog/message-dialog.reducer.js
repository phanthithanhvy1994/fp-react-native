import { INITIAL_STATE } from '../initialState';
import { MessageDialogAction } from './message-dialog.types';

const messageDialogReducer = (
  state = INITIAL_STATE.messageDialogStore,
  action
) => {
  switch (action.type) {
    case MessageDialogAction.OPEN_DIALOG:
      return {
        title: action.payload.title,
        type: action.payload.type,
        content: action.payload.content,
        actions: action.payload.actions,
        disableBackdropClick: action.payload.disableBackdropClick,
        isOpen: true,
        isTableLayout: action.payload.isTableLayout,
      };
    case MessageDialogAction.CLOSE_DIALOG:
      return {
        ...INITIAL_STATE.messageDialogStore,
      };
    default:
      return state;
  }
};

export default messageDialogReducer;
