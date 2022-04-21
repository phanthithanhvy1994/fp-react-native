import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { useStyles } from './search-popup.style';

function SearchPopup(props) {
  const classes = useStyles();
  const { open, handleClose, classPopUp, childComponent, title } = props;

  return (
    <Dialog
      className={`${classes.detailDialog} ${classPopUp} ${classes.searchPopUp}`}
      open={open}
      onClose={handleClose}
      disableBackdropClick={true}
    >
      <div className={`${classes.titlePage} subtitle`}>
        <DialogTitle id="customized-dialog-title">{title}</DialogTitle>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {open && <DialogContent dividers>{childComponent}</DialogContent>}
    </Dialog>
  );
}

SearchPopup.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  classPopUp: PropTypes.any,
  childComponent: PropTypes.any,
  title: PropTypes.string,
};

export default withTranslation()(SearchPopup);
