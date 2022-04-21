import map from 'lodash/map';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PropTypes from 'prop-types';
import useStyles from '../../../../style/core/field/multi-select';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function MultiSelect(props) {
  const { onChange, item } = props;
  const classes = useStyles();

  // Render input tag name
  const renderTags = () => (
    <span className={classes.textInput}>
      {map(item.value, select => select && select.display).join(', ')}
    </span>
  );

  // Modify return value to onChange
  const handleOnChange = (event, options) => {
    if (options.length === 0) {
      onChange(event, options);
      return;
    }

    let selectedItems = item.value || [];
    const newItem = options[options.length - 1];
    const selectIds = map(selectedItems, 'value');
    const isSelected = includes(selectIds, newItem.value);

    if (isSelected) {
      selectedItems = filter(
        selectedItems,
        selectedItem => selectedItem.value !== newItem.value
      );
    } else {
      selectedItems.push(newItem);
    }
    onChange(event, selectedItems);
  };

  // Render checkboxes option
  const renderOption = option => {
    const selectIds = map(item.value, 'value');
    const isSelected = includes(selectIds, option.value);
    return (
      <div className={classes.optionBody}>
        <Checkbox icon={icon} checkedIcon={checkedIcon} checked={isSelected} />
        <span>{option.display}</span>
      </div>
    );
  };

  return (
    <Autocomplete
      multiple
      classes={{
        root: classes.root,
        focused: classes.focused,
        popper: classes.popper,
        listbox: classes.listbox,
      }}
      value={item.value || []}
      getOptionLabel={option => option.display}
      options={item.data}
      disableCloseOnSelect
      disabled={item.disabled || false}
      renderTags={renderTags}
      onChange={(event, options) => handleOnChange(event, options)}
      renderOption={option => renderOption(option)}
      renderInput={params => (
        <TextField {...params} error={item.errors} variant="outlined" />
      )}
    />
  );
}

MultiSelect.propTypes = {
  t: PropTypes.any,
  item: PropTypes.object,
  onChange: PropTypes.func,
};
