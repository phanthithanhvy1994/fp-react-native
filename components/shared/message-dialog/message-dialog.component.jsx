import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';

import MatDialog from '@material-ui/core/Dialog';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Warning, Error, Info, Help, Cancel } from '@material-ui/icons/';

import TableGrid from '../table-grid/table-grid.component';
import Button from '../buttons/button.component';

// Use redux
import { closeDialog } from '../../../redux/message-dialog/message-dialog.actions';
// Styles
import useStyles from '../../../style/core/dialog/dialog';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { optionTableLayoutMessage } from './message-dialog.config';
import './message-dialog.style.scss';

function Dialog(props) {
  const { isOpen, isTableLayout, type, title, content, actions } = props;
  // Styles API
  const classes = useStyles();

  const handleClose = () => {
    closeDialog();
  };

  const getIcon = () => {
    switch (type) {
      // Error message
      case dialogConstant.type.ERROR:
        return <Error className={classes.errorIcon} />;
      // Warning message
      case dialogConstant.type.WARNING:
        return <Warning className={classes.warningIcon} />;
      // Confirm message
      case dialogConstant.type.CONFIRM:
        return <Help className={classes.confirmIcon} />;
      // Info message
      default:
        return <Info className={classes.infoIcon} />;
    }
  };

  const getButton = (button, index) => {
    let properties = null;
    switch (button.type) {
      // Functional button
      case dialogConstant.button.FUNCTION:
        properties = {
          key: index,
          handleClick: () => {
            handleClose();
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

  let actualContent = '';
  if (Array.isArray(content)) {
    actualContent = content.map((el, index) => (
      <DialogContentText key={index}>{el}</DialogContentText>
    ));
  } else {
    actualContent = <DialogContentText>{content}</DialogContentText>;
  }

  return (
    <MatDialog open={isOpen} onClose={handleClose} disableBackdropClick={true}>
      <div
        className={
          isTableLayout ? classes.fpbContainerTableLayout : classes.fpbContainer
        }
      >
        <DialogTitle className={`${classes.dlgTitle} subtitle`}>
          {title}
        </DialogTitle>

        {isTableLayout ? (
          <DialogContent className={classes.dlgTableContent}>
            <div className={classes.messageTableTitleDiv}>
              <Cancel className={classes.cancelIcon} />
              <div className={classes.dlgTableContentTitle}>
                {content.messageTableTitle}
              </div>
            </div>
            <TableGrid
              columns={content.messageTableColumns}
              dataTable={content.messageTableData}
              options={optionTableLayoutMessage}
              hidePagination={true}
            />
          </DialogContent>
        ) : (
          <DialogContent className={classes.dlgContent}>
            <div className={classes.iconDiv}>{getIcon()}</div>
            <div className={classes.contentDiv}>{actualContent}</div>
          </DialogContent>
        )}

        <DialogActions className={classes.dlgAction}>
          {renderButton()}
        </DialogActions>
      </div>
    </MatDialog>
  );
}

Dialog.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  content: PropTypes.any,
  actions: PropTypes.array,
  isOpen: PropTypes.bool,
  isTableLayout: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
};

const getDialogInfo = (storeData) => storeData.messageDialogStore;

const selectDialogInfo = createSelector(
  [getDialogInfo],
  (dialogData) => dialogData
);

function mapStateToProps(storeData) {
  return { ...selectDialogInfo(storeData) };
}

export default connect(mapStateToProps)(Dialog);
