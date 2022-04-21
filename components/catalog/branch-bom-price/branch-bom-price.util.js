import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { dialogConstant } from '../../../constants/constants';
import { buttonConstant } from '../../../util/constant';

export const showInformation = (messageContent, action) => {
  openDialog({
    title: Message.INFORMATION,
    content: messageContent,
    type: dialogConstant.type.INFORMATION,
    actions: [
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
        action: () => {
          action && action();
        }
      },
    ],
  });
};

export const showConfirmation = () => {
  return 'confirmation';
};

export const showError = (messageContent) => {
  openDialog({
    title: Message.ERROR,
    content: messageContent,
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

export const calculateExVat = (price) => +((price * 100) / 107).toFixed(2);
