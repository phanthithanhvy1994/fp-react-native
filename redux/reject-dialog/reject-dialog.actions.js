import { RejectDialogAction } from './reject-dialog.types';
import store from '../store';

export const openRejectDialog = rejectConfig => {
  store.dispatch({
    type: RejectDialogAction.OPEN_REJECT_DIALOG,
    payload: rejectConfig,
  });
};

export const closeRejectDialog = () => {
  store.dispatch({
    type: RejectDialogAction.CLOSE_REJECT_DIALOG,
  });
};
