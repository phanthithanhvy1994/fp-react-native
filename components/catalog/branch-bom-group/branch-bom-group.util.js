import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { dialogConstant } from '../../../constants/constants';
import { buttonConstant } from '../../../util/constant';

export const showInformation = (messageContent) => {
  openDialog({
    title: Message.INFORMATION,
    content: messageContent,
    type: dialogConstant.type.INFORMATION,
    actions: [
      {
        name: 'OK',
        type: dialogConstant.button.FUNCTION,
        className: buttonConstant.type.PRIMARY,
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

export const reStructureFields = (params) => {
  return {
    bomBranchCode: {
      like:
        params.bomBranchCode?.length > 0
          ? params.bomBranchCode?.trim()
          : undefined,
    },
    bomBranchName: {
      like:
        params.bomBranchName?.length > 0
          ? params.bomBranchName?.trim()
          : undefined,
    },
    level: {
      in:
        (Array.isArray(params.level) &&
          params.level.map((param) => param.value)) ||
        undefined,
    },
  };
};
