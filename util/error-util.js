export const getErrorMessage = (response) => {
  let errMsg = '';
  if (response && response.message && response.message.messages) {
    errMsg = response.message.messages[0] && response.message.messages[0].messageContent;
  }
  return errMsg;
};

export const getErrorMessageCode = (response) => {
  let errMsg = '';
  if (response && response.message && response.message.messages) {
    errMsg = response.message.messages[0] && response.message.messages[0].messageCode;
  }
  return errMsg;
};
