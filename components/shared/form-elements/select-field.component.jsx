import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextField, MenuItem } from '@material-ui/core';

class SelectField extends React.Component {
  render() {
    const { value = '', isView, isPaging, ...otherProps } = this.props;
    let { options } = this.props;
    options = !options || isView ? [{ key: value, value }] : options;
    if (!isPaging) {
      options = _.orderBy(
        options,
        [option => option.key.toLowerCase()],
        ['asc']
      );
    }
    return (
      <TextField select value={value} fullWidth margin="normal" {...otherProps}>
        {_.map(options, (option, i) => (
          <MenuItem key={i} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      </TextField>
    );
  }
}
SelectField.propTypes = {
  component: PropTypes.any,
  value: PropTypes.any,
  isView: PropTypes.any,
  isPaging: PropTypes.any,
  options: PropTypes.any,
  otherProps: PropTypes.any,
};
export default SelectField;
