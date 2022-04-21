import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { DefaultToast } from 'react-toast-notifications';
import { withStyles } from '@material-ui/styles';
import useStyles from './toast.style';
import './toast.style.scss';

const CustomToastContainer = (props) => {
  const { appearance, classes, children } = props;
  return (
    <DefaultToast className={classes.toastContainer} {...props}>
      <div className={`toast-message ${appearance} ${classes.toast}`}>
        <CheckCircleIcon className='toast-icon'/>
        <p className='toast-content'>{children}</p>
      </div>
    </DefaultToast>
  );
};

CustomToastContainer.propTypes = {
  appearance: PropTypes.string,
  children: PropTypes.any,
  classes: PropTypes.object
};

export default withStyles(useStyles)(CustomToastContainer);