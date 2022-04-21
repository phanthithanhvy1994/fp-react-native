import React from 'react';
// import map from 'lodash/map';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import useStyles from '../../../../style/core/outlinedInput/outlinedInput';

class SelectField extends React.Component {

  renderOption = option => {
    const { classes } = this.props;

    return (
      <div className={classes.optionBody}>
        <span>{option?.display || ''}</span>
      </div>
    );
  };

  handleValue = item => {
    const { value, data } = item;
    const result = data && data.find(
      option => (String(option.value) === String(value))
    );

    return (result || {});
  };

  render() {
    const { item, onChange, classes } = this.props;
    return (
      <Autocomplete
        classes={{
          root: classes.root,
          focused: classes.focused,
          popper: classes.popper,
          listbox: classes.listbox,
        }}
        value={this.handleValue(item)}
        getOptionLabel={option => option.display || ''}
        options={item?.data || []}
        disableClearable
        disabled={item?.disabled || false}
        onChange={onChange}
        renderOption={option => this.renderOption(option)}
        renderInput={params => (
          <TextField {...params} error={item?.errors} variant="outlined" />
        )}
      />
    );
  }
}

SelectField.propTypes = {
  classes: PropTypes.object,
  item: PropTypes.any,
  onChange: PropTypes.func,
};

export default withStyles(useStyles)(SelectField);
