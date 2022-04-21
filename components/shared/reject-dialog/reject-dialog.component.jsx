import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import MatDialog from '@material-ui/core/Dialog';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons/';

import Button from '../buttons/button.component';

// Use redux
import { closeRejectDialog } from '../../../redux/reject-dialog/reject-dialog.actions';
// Styles
import useStyles from '../../../style/core/dialog/dialog';
import { dialogConstant, buttonConstant } from '../../../util/constant';

function RejectDialog(props) {
  const {
    isOpen,
    title,
    messageTitle,
    actions,
    disableBackdropClick,
    submitApiFn,
    afterSubmitFn,
    handleFor,
    isNormalInput,
    maxLength
  } = props;
  // Styles API
  const classes = useStyles();

  const [messageReason, setMessageReason] = useState('');

  const handleClose = () => {
    closeRejectDialog();
  };

  // Handle for reason input value
  const handleInputValue = (event) => {
    const { value } = event.target;

    setMessageReason(value);
  };

  const handleSubmit = () => {
    if (!submitApiFn) {
      closeRejectDialog();
    } else {
      submitApiFn(messageReason, handleFor).then((res) => {
        closeRejectDialog();
        if (afterSubmitFn) {
          afterSubmitFn(res);
        }
      });
    }
  };

  const getButton = (button, index) => {
    let properties = null;
    switch (button.type) {
      // Functional button(OK)
      case dialogConstant.button.FUNCTION:
        properties = {
          key: index,
          handleClick: () => {
            handleSubmit();
            return button.action && button.action();
          },
          className: button.className,
          title: button.name,
        };
        break;
      // None functional button(Cancel)
      default:
        properties = {
          key: index,
          handleClick: handleClose,
          className: buttonConstant.type.CANCEL,
          title: button.name,
        };
        break;
    }
    return (
      <Button
        key={properties.key}
        handleClick={properties.handleClick}
        className={properties.className}
        title={properties.title}
        icon={properties.icon}
      />
    );
  };

  // eslint-disable-next-line no-confusing-arrow
  const renderButton = () =>
    actions ? actions.map((button, index) => getButton(button, index)) : null;

  // Disable render component
  // eslint-disable-next-line no-extra-boolean-cast
  if (!Boolean(props.isOpen)) {
    return null;
  }

  return (
    <MatDialog
      open={isOpen}
      onClose={handleClose}
      disableBackdropClick={disableBackdropClick}
    >
      <div className={classes.rFpbContainer}>
        <DialogTitle className={classes.rDlgTitle}>{title}</DialogTitle>
        <DialogContent className={classes.rejectDlgContent}>
          <Cancel className={classes.errorIcon} />
          <DialogContentText className={classes.dlgMessageTitle}>
            {messageTitle}
          </DialogContentText>
          {!isNormalInput && (
            <TextareaAutosize
              placeholder="Input reason"
              rowsMax={4}
              onChange={handleInputValue}
            />)}
        </DialogContent>
        {isNormalInput && (
          <TextField
            placeholder="Input reason"
            className="reason-text-field"
            InputProps={{
              inputProps: {
                maxLength: maxLength
              }
            }}
            onChange={handleInputValue}
          />)}
        <DialogActions className={classes.dlgAction}>
          {renderButton()}
        </DialogActions>
      </div>
    </MatDialog>
  );
}

RejectDialog.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  messageTitle: PropTypes.string,
  actions: PropTypes.array,
  disableBackdropClick: PropTypes.bool,
  submitApiFn: PropTypes.func,
  afterSubmitFn: PropTypes.func,
  handleFor: PropTypes.string,
  isNormalInput: PropTypes.bool,
  maxLength: PropTypes.number
};

const getRejectDialogInfo = (storeData) => storeData.rejectDialogStore;

const selectRejectDialogInfo = createSelector(
  [getRejectDialogInfo],
  (rejectDialogData) => rejectDialogData
);

function mapStateToProps(storeData) {
  return { ...selectRejectDialogInfo(storeData) };
}

export default connect(mapStateToProps)(RejectDialog);
