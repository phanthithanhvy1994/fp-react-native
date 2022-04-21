import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

class InputField extends React.Component {
  render() {
    const { value = '', ...otherProps } = this.props;
    return (
      <TextField
        style={{ height: '28px' }}
        fullWidth
        margin="normal"
        value={value}
        {...otherProps}
      />
    );
  }
}

InputField.propTypes = {
  value: PropTypes.any,
};

export default InputField;
