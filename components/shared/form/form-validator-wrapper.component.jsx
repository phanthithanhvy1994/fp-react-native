import React from 'react';
import PropTypes from 'prop-types';

export default class FormValidatorWrapper extends React.Component {
  render() {
    const { error } = this.props;
    return (
      <>
        {this.props.children}
        {error && <span className="help-block text-danger">{error}</span>}
      </>
    );
  }
}

FormValidatorWrapper.propTypes = {
  children: PropTypes.any,
  error: PropTypes.any,
};
