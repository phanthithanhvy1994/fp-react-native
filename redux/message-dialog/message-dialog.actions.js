import { MessageDialogAction } from './message-dialog.types';
import { Message } from '../../constants/messages';
import { dialogConstant, buttonConstant } from '../../util/constant';
import store from '../store';

export const openDialog = messageConfig => {
  store.dispatch({
    type: MessageDialogAction.OPEN_DIALOG,
    payload: messageConfig,
  });
};

export const closeDialog = () => {
  store.dispatch({
    type: MessageDialogAction.CLOSE_DIALOG,
  });
};

export const showInformationDialog = (msg, submitAction) => {
  openDialog({
    title: Message.INFORMATION,
    content: msg,
    disableBackdropClick: true,
    actions: [
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
        action: () => {
          submitAction && submitAction();
        }
      },
    ],
  });
};

export const showErrorDialog = (msg, isTableLayout = false) => {
  openDialog({
    title: Message.ERROR,
    content: msg,
    disableBackdropClick: true,
    isTableLayout: isTableLayout,
    type: dialogConstant.type.ERROR,
    actions: [
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
      },
    ],
  });
};

export const showConfirmDialog = (msg, confirmAction, cancelAction) => {
  openDialog({
    title: Message.CONFIRM,
    content: msg,
    disableBackdropClick: true,
    type: dialogConstant.type.CONFIRM,
    actions: [
      {
        name: 'Cancel',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.NEUTRAL,
        action: () => {
          cancelAction && cancelAction();
        }
      },
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
        action: () => {
          confirmAction();
        }
      },
    ],
  });
};

export const showWarningDialog = (msg, submitAction) => {
  openDialog({
    title: Message.warning,
    content: msg,
    disableBackdropClick: true,
    type: dialogConstant.type.WARNING,
    actions: [
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
        action: () => {
          submitAction && submitAction();
        }
      },
    ],
  });
};
