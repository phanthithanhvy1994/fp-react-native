import React from 'react';
import PropTypes from 'prop-types';

function FormErrors(props) {
  if (
    props.formerrors &&
    (props.formerrors.blankfield || props.formerrors.passwordmatch)
  ) {
    return (
      <div className="error container help is-danger">
        <div className="row justify-content-center">
          {props.formerrors.passwordmatch
            ? 'Password value does not match confirm password value'
            : ''}
        </div>
        <div className="row justify-content-center help is-danger">
          {props.formerrors.blankfield ? 'All fields are required' : ''}
        </div>
      </div>
    );
  }
  if (props.apierrors) {
    return (
      <div className="error container help is-danger">
        <div className="row justify-content-center">{props.apierrors}</div>
      </div>
    );
  }
  if (props.formerrors && props.formerrors.cognito) {
    return (
      <div className="error container help is-danger">
        <div className="row text-danger">
          {props.formerrors.cognito.message}
        </div>
      </div>
    );
  }
  return <div />;
}

FormErrors.propTypes = {
  formerrors: PropTypes.any,
  apierrors: PropTypes.any,
};

export default FormErrors;
