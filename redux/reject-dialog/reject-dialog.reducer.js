import { INITIAL_STATE } from '../initialState';
import { RejectDialogAction } from './reject-dialog.types';

const rejectDialogReducer = (
  state = INITIAL_STATE.rejectDialogStore,
  action
) => {
  switch (action.type) {
    case RejectDialogAction.OPEN_REJECT_DIALOG:
      return {
        title: action.payload.title,
        messageTitle: action.payload.messageTitle,
        actions: action.payload.actions,
        disableBackdropClick: action.payload.disableBackdropClick,
        // Function which calls to API to handle for submitted data.
        // It should be a promise function.
        submitApiFn: action.payload.submitApiFn,
        // Function handle .
        // It should be a promise function.
        afterSubmitFn: action.payload.afterSubmitFn,
        handleFor: action.payload.handleFor,
        maxLength: action.payload.maxLength,
        isNormalInput: action.payload.isNormalInput,
        isOpen: true,
      };
    case RejectDialogAction.CLOSE_REJECT_DIALOG:
      return {
        ...INITIAL_STATE.rejectDialogStore,
      };
    default:
      return state;
  }
};

export default rejectDialogReducer;
