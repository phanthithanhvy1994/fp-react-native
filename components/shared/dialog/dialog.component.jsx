import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '../buttons/button.component';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export default function FPDialog(props) {
  const classes = useStyles();
  const {
    buttonType,
    title,
    isFullWidth = true,
    children,
    isOpen = false,
    isClosed,
    buttonIcon,
    titleDialog,
    classCustomDialog,
    getDialogStatus = () => {},
  } = props;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleClickOpen();
  }, [isOpen]);

  useEffect(() => {
    handleClose();
  }, [isClosed]);

  useEffect(() => {
    getDialogStatus(open);
  }, [open, getDialogStatus]);

  return (
    <React.Fragment>
      <Button
        className={buttonType}
        title={title}
        icon={buttonIcon}
        handleClick={handleClickOpen}
      ></Button>
      <Dialog
        fullWidth={isFullWidth}
        maxWidth={'lg'}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        disableBackdropClick={true}
      >
        <div className={`${classCustomDialog} `}>
          <DialogTitle id="max-width-dialog-title">
            {titleDialog && <span>{titleDialog}</span>}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
          {/* <DialogActions>
            <Button handleClick={handleClose}>Close</Button>
          </DialogActions> */}
        </div>
      </Dialog>
    </React.Fragment>
  );
}

FPDialog.propTypes = {
  buttonType: PropTypes.string,
  title: PropTypes.string,
  isFullWidth: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.any,
  openDialog: PropTypes.func,
  isOpen: PropTypes.bool,
  isClosed: PropTypes.bool,
  buttonIcon: PropTypes.object,
  titleDialog: PropTypes.string,
  classCustomDialog: PropTypes.any,
  getDialogStatus: PropTypes.func,
};
