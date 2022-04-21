import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import {
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  IconButton,
} from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormLabel from '@material-ui/core/FormLabel';
import NumberFormat from 'react-number-format';
import Button from '../buttons/button.component';

import UploadFile from '../file-upload/file-upload.component';
import MultiSelect from './custom/MultiSelect';
import SelectField from './custom/SelectField';
import { FieldConstant, NumberConstant } from '../../../constants/constants';
import Calendar from './custom/Calendar';
import NumberFormatCustom from './custom/NumberFormat';

import useStyles from '../../../style/core/field/field';
import '../../../style/core/field/field.styles.scss';

class Field extends React.Component {
  renderFieldType = (item, classes, index) => {
    switch (item.fieldType) {
      case FieldConstant.type.TEXT:
      case FieldConstant.type.NUMBER:
        return this.renderTextFields(item, classes, index);
      case FieldConstant.type.NUMBER_DECIMAL:
        return this.renderNumberFields(item, classes, index);
      case FieldConstant.type.TEXT_ONLY:
        return this.renderTextOnlyFields(item, classes, index);
      case FieldConstant.type.PICKER:
        return this.renderDatePickers(item, classes, index);
      case FieldConstant.type.SELECT:
        return this.renderSelects(item, classes, index);
      case FieldConstant.type.MULTI_SELECT:
        return this.renderMultiSelects(item, classes, index);
      case FieldConstant.type.CHECKBOX:
        return this.renderCheckbox(item, classes, index);
      case FieldConstant.type.RANGE_INPUT:
        return this.renderRangeInput(item, classes, index);
      case FieldConstant.type.QUANTITY:
        return this.renderQtyFields(item, classes, index);
      case FieldConstant.type.UPLOAD_FILE:
        return this.renderUploadFields(item, classes, index);
      case FieldConstant.type.RADIO:
        return this.renderRadio(item, classes, index);
      case FieldConstant.type.TEXT_AREA:
        return this.renderTextArea(item, classes, index);
      default:
        return this.renderTextFields(item, classes, index);
    }
  };

  renderRadio = (item, classes, index) => {
    const { onChange } = this.props;
    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <FormControl component="fieldset" className={item.classCustom}>
            <FormLabel className={classes.Radio} required={item.required}>
              {item.label}
            </FormLabel>
            <RadioGroup
              aria-label={item.type}
              name={item.fieldName}
              value={item.value}
              onChange={(e) => onChange(e, true)}
              className={classes.btnRadio}
            >
              {item.data.map((i, index) => (
                <React.Fragment key={index}>
                  <FormControlLabel
                    key={index}
                    value={i.value}
                    control={<Radio />}
                    label={i.name}
                  />
                  {i.inputField && !i.inputField.hidden && (
                    <TextField
                      id={i.inputField.id}
                      name={i.inputField.fieldName}
                      type={i.inputField.fieldType}
                      value={i.inputField.value}
                      onChange={(e) => onChange(e, true)}
                      className={`${classes.fpbField}
                      ${classes[i.inputField.className]}
                      field-wrapper`}
                      variant="outlined"
                      InputProps={{
                        inputProps: {
                          min: i.inputField.minVal,
                          autoComplete: i.inputField.autoComplete || 'off',
                          isDecimal: i.inputField.isDecimal,
                        },
                        inputComponent: NumberFormatCustom
                      }}

                    />
                  )}
                </React.Fragment>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      </React.Fragment>
    );
  };

  renderIcon = (item) => {
    switch (item.startAdornment) {
      case 'PersonIcon':
        return <PersonIcon />;
      case 'LockIcon':
        return <LockIcon />;
      default:
        return '';
    }
  };

  renderRangeInput = (item, classes, index) => {
    let dropDownOpr = null;
    let searchInput = null;

    if (typeof item.operator === 'object') {
      if (item.classSelectRight) {
        const oprField = {
          ...item.searchInput,
          label: item.label,
          match: item.searchInput.fieldName,
        };
        dropDownOpr = this.renderFieldType(oprField, classes);
      } else {
        const oprField = {
          ...item.operator,
          label: item.label,
          match: item.operator.fieldName,
        };
        dropDownOpr = this.renderSelects(oprField, classes);
      }
    }

    if (item.inputType === 'date') {
      const inputField = { ...item.searchInput, value: item.value };
      searchInput = this.renderDatePickersRange(inputField, classes);
    } else if (item.classSelectRight) {
      const inputField = {
        ...item.operator,
        match: item.operator.fieldName,
      };
      searchInput = this.renderSelects(inputField, classes);
    } else {
      const inputField = {
        ...item.searchInput,
        match: item.searchInput.fieldName,
      };
      searchInput = this.renderTextFields(inputField, classes);
    }

    return (
      <div
        key={index}
        className={`${classes[item.className]} ${
          item.classCustom
        } field-wrapper ${
          item.inputType === 'date' ? 'MuiFormControl-root' : ''
        }`}
      >
        {dropDownOpr}
        {searchInput}
      </div>
    );
  };

  formatNumberField = (e, item, onChange, isInteger) => {
    const { value } = e.target;
    const numberRegex = isInteger ? /[^\d]/g : /[^.\d]/g;

    e.target.value = +value
      .replace(numberRegex, '')
      .replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');
    const valueDefault = e.target.value === '0' ? 1 : e.target.value;
    onChange(item, valueDefault);
    return e;
  };

  renderQtyFields = (item, classes, index) => {
    const {
      classCustom,
      value,
      label,
      unitLabel,
      isOnFormField,
      decimalCharacter,
      maximumValue,
      minimumValue,
      increaseInValue,
      disabled,
      isShowThousandSeparator,
      numberDecimalCharacter,
    } = item;
    const { onChange, errors } = this.props;

    let minimum = minimumValue || NumberConstant.minimumValue;
    let maximum = maximumValue || NumberConstant.maximumValue;

    // Check Range Input case
    const errorFieldName = !item.match ? item.fieldName : item.match;
    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <div
            className={`${classes.quantityField} ${
              isOnFormField ? classes.quantityFieldOnFormField : ''
            } ${classCustom} field-wrapper`}
          >
            <span
              className={`decrease-qty-span ${disabled ? 'disabled' : ''}`}
              onClick={() => {
                let tempValue = +value;

                // If value is decimal, apply this rule when decreasing:
                // Ex: 11.25 => 11   11.99 => 11   11 => 10
                if (+value % 1 !== 0) {
                  tempValue = Math.trunc(tempValue);
                } else {
                  increaseInValue
                    ? (tempValue -= increaseInValue)
                    : (tempValue -= 1);
                }

                if (minimum !== undefined && tempValue < minimum) {
                  return;
                } else {
                  onChange(item, tempValue);
                }
              }}
            >
              <Button icon={<RemoveIcon />} />
            </span>
            <NumberFormat
              InputProps={{
                endAdornment: item.endAdornment && (
                  <InputAdornment
                    position="end"
                    className={classes.fieldEndAdornment}
                  >
                    {item.endAdornment.endTextLabel && (
                      <div className={classes.endTextLabel}>
                        {item.endAdornment.endTextLabel}
                      </div>
                    )}
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                required: item.required,
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              value={value}
              label={label}
              error={(errors && !!errors[errorFieldName]) || false}
              helperText={
                errors &&
                errors[errorFieldName] &&
                errors[errorFieldName].message
              }
              thousandSeparator={
                isShowThousandSeparator === undefined
                  ? true
                  : isShowThousandSeparator
              }
              decimalSeparator={decimalCharacter || '.'}
              decimalScale={
                numberDecimalCharacter !== undefined
                  ? numberDecimalCharacter
                  : 2
              }
              disabled={disabled}
              customInput={TextField}
              isAllowed={(valueObj) => {
                // Check if value is valid
                if (minimum !== undefined && minimum > +valueObj.value) {
                  return false;
                }
                if (maximum !== undefined && maximum < +valueObj.value) {
                  return false;
                }
                return true;
              }}
              onValueChange={(valueObj) => {
                onChange(
                  item,
                  valueObj.value && valueObj.value.replace(/,/g, '')
                );
              }}
            />
            <span
              className={`increase-qty-span ${disabled ? 'disabled' : ''}`}
              onClick={() => {
                let tempValue = +value;

                // If value is decimal, increase follow this rule:
                // Ex: 11 => 12,   11.25 => 12,   11.99 => 12
                if (+value % 1 !== 0) {
                  tempValue = Math.ceil(+value);
                } else {
                  increaseInValue
                    ? (tempValue += increaseInValue)
                    : (tempValue += 1);
                }

                if (maximum !== undefined && tempValue > maximum) {
                  return;
                } else {
                  onChange(item, tempValue);
                }
              }}
            >
              <Button icon={<AddIcon />} />
              {unitLabel && (
                <span className={classes.unitLabel}>{unitLabel}</span>
              )}
            </span>
          </div>
        )}
      </React.Fragment>
    );
  };

  renderTextFields = (item, classes, index) => {
    const classDefault = clsx(item.classCustom, classes.fpbField);
    const { onChange, errors, t, onKeyPress } = this.props;
    // Set value when onChange
    const value = item.value || '';
    // Check Range Input case
    const errorFieldName = !item.match ? item.fieldName : item.match;
    const { endAction, onItemKeyPress } = item;

    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <div className={`field-wrapper ${item.classParent}`}>
            <TextField
              key={index}
              id={item.id}
              name={item.fieldName}
              label={item.label && t(item.label)}
              type={item.fieldType}
              value={value}
              onKeyPress={(event) => {
                onKeyPress && onKeyPress(event);
                onItemKeyPress && onItemKeyPress(event);
              }}
              onChange={(event) =>
                onChange({
                  target: {
                    // auto uppercase value when input
                    value: item.autoUppercase
                      ? event.target.value.toUpperCase()
                      : event.target.value,
                    name: item.fieldName,
                    customOnChange: item.customOnChange,
                  },
                })
              }
              placeholder={item.placeholder}
              disabled={item.disabled || false}
              // If range input validated show match error message
              error={(errors && !!errors[errorFieldName]) || false}
              helperText={
                errors &&
                errors[errorFieldName] &&
                errors[errorFieldName].message
              }
              InputLabelProps={{
                shrink: true,
                required: item.required,
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
                inputProps: {
                  min: item.minVal,
                  maxLength: item.maxLength,
                  autoComplete: 'off',
                },
                startAdornment: item.startAdornment && (
                  <InputAdornment position="start">
                    {this.renderIcon(item)}
                  </InputAdornment>
                ),
                endAdornment: item.endAdornment && (
                  <InputAdornment
                    position="end"
                    className={classes.fieldEndAdornment}
                  >
                    {item.endAdornment.endTextLabel && (
                      <div className={classes.endTextLabel}>
                        {item.endAdornment.endTextLabel}
                      </div>
                    )}
                    <IconButton
                      disabled={item.endAdornment.disabled || item.disabled}
                      onClick={
                        !item.disabled
                          ? item.endAdornment.handleClick
                          : () => {}
                      }
                    >
                      {item.endAdornment.icon && item.endAdornment.icon()}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className={`${classDefault}
                ${classes[item.className]}
                ${item.endAction ? ' field-end-action' : ''}
                field-wrapper`}
              variant="outlined"
            />
            {endAction && (
              <IconButton
                onClick={endAction.onClick}
                className={`
                ${classes.btnEndAction}
                ${endAction.className || ''}`}
              >
                {endAction.icon()}
              </IconButton>
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  renderNumberFields = (item, classes, index) => {
    const classDefault = clsx(item.classCustom, classes.fpbField);
    const { onChange, errors, t, onKeyPress } = this.props;
    // Set value when onChange
    const value = (item.value !== undefined) ? item.value : '';
    // Check Range Input case
    const errorFieldName = !item.match ? item.fieldName : item.match;
    const { endAction, onItemKeyPress, isDecimal } = item;

    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <div className={`field-wrapper ${item.classParent}`}>
            <TextField
              key={index}
              id={item.id}
              name={item.fieldName}
              label={item.label && t(item.label)}
              value={value}
              onKeyPress={(event) => {
                onKeyPress && onKeyPress(event); 
                onItemKeyPress && onItemKeyPress(event);
              }}
              onChange={(event) =>{
                onChange({
                  target: {
                    value: ((item.maxVal !== undefined) && (+event.target.value > +item.maxVal))
                      ? item.maxVal
                      : ((item.minVal !== undefined) && (+event.target.value < +item.minVal))
                        ? item.minVal
                        : event.target.value,
                    name: item.fieldName,
                    customOnChange: item.customOnChange,
                  },
                });
              }}
              placeholder={item.placeholder}
              disabled={item.disabled || false}
              // If range input validated show match error message
              error={(errors && !!errors[errorFieldName]) || false}
              helperText={
                errors &&
                errors[errorFieldName] &&
                errors[errorFieldName].message
              }
              InputLabelProps={{
                shrink: true,
                required: item.required,
                classes: {
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                },
              }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
                inputProps: {
                  min: item.minVal,
                  max: item.maxVal,
                  maxLength: item.maxLength,
                  autoComplete: 'off',
                  isDecimal: isDecimal
                },
                startAdornment: item.startAdornment && (
                  <InputAdornment position="start">
                    {this.renderIcon(item)}
                  </InputAdornment>
                ),
                endAdornment: item.endAdornment && (
                  <InputAdornment
                    position="end"
                    className={classes.fieldEndAdornment}
                  >
                    {item.endAdornment.endTextLabel && (
                      <div className={classes.endTextLabel}>
                        {item.endAdornment.endTextLabel}
                      </div>
                    )}
                    <IconButton
                      disabled={item.endAdornment.disabled || item.disabled}
                      onClick={
                        !item.disabled
                          ? item.endAdornment.handleClick
                          : () => {}
                      }
                    >
                      {item.endAdornment.icon && item.endAdornment.icon()}
                    </IconButton>
                  </InputAdornment>
                ),
                
                inputComponent: NumberFormatCustom,
              }}
              className={`${classDefault}
                ${classes[item.className]}
                ${item.endAction ? ' field-end-action' : ''}
                field-wrapper`}
              variant="outlined"
            />
            {endAction && (
              <IconButton
                onClick={endAction.onClick}
                className={`
                ${classes.btnEndAction}
                ${endAction.className || ''}`}
              >
                {endAction.icon()}
              </IconButton>
            )}
          </div>
        )}
      </React.Fragment>
    );
  };

  renderTextOnlyFields = (item, classes, index) => {
    const { label, value } = item;
    return (
      <div
        className={`${classes.textLabelField} Field-textLabelField`}
        key={index}
        hidden={item.hidden}
      >
        <div className={` ${classes.textLabel} label`}>
          <Typography>{`${label}`}</Typography>
        </div>
        <div className={` ${classes.textLabelValue} label-value`}>
          <Typography>{`${value !== undefined ? value : ''}`}</Typography>
        </div>
      </div>
    );
  };

  renderDatePickersRange = (item, classes, index) => {
    // Set minDate, maxDate
    const cloneItem = { ...item, maxDate: undefined, minDate: undefined };
    const { ge, le } = item.value;
    // For ge field
    const firstItem = _.cloneDeep(cloneItem);
    firstItem.firstInRange = true;
    if (le) {
      firstItem.maxDate = le;
    }
    const fromField = this.renderDatePickers(firstItem, classes, index);

    // For le field
    // No need render label for second field
    const secondItem = _.cloneDeep(cloneItem);
    secondItem.label = ' ';
    secondItem.secondInRange = true;
    if (ge) {
      secondItem.minDate = ge;
    }
    const toField = this.renderDatePickers(secondItem, classes, index);

    return (
      <div>
        <div
          className={`${classes.dateRange} MuiFormControl-root field-wrapper`}
        >
          {fromField}
          <span className="range-label"> to </span>
          {toField}
        </div>
      </div>
    );
  };

  renderDatePickers = (item, classes, index) => {
    const { onChange, errors } = this.props;
    const { value } = item;
    let range;
    // Assign value base on its position if it is a date range field
    if (item.firstInRange) {
      range = value.ge;
    } else if (item.secondInRange) {
      range = value.le;
    } else {
      range = value;
    }

    const errorFieldName = !item.match ? item.fieldName : item.match;
    return (
      <Calendar
        key={index}
        onChange={onChange}
        item={item}
        value={range}
        minDate={item.minDate}
        maxDate={item.maxDate}
        classCustom={item.classCustom}
        errors={errors}
        errorFieldName={errorFieldName}
      />
    );
  };

  renderSelects = (item, classes, index) => {
    const { onChange, errors, t } = this.props;
    const classDefault = clsx(item.classCustom, classes.fpbField);
    // Check Range Input case
    const errorFieldName = !item.match ? item.fieldName : item.match;

    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <FormControl
            className={`${classDefault} ${classes[item.className]} ${
              item.classParent
            } field-wrapper`}
            variant="outlined"
            // If range input validated show select box error message
            error={(errors && !!errors[errorFieldName]) || false}
            disabled={item.disabled || false}
            value={item.value}
          >
            {item.label && (
              <InputLabel
                required={item.required}
                htmlFor={item.id}
                shrink={true}
                classes={{
                  root: classes.labelRoot,
                  focused: classes.labelFocused,
                }}
              >
                {t(item.label)}
              </InputLabel>
            )}
            <SelectField
              item={item}
              onChange={(event, option) =>
                onChange({
                  target: {
                    value: option.value,
                    name: item.fieldName,
                    customOnChange: item.customOnChange,
                  },
                })
              }
            />
            {/* Set error message */}
            {errors && (
              <FormHelperText>
                {errors[errorFieldName] && errors[errorFieldName].message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      </React.Fragment>
    );
  };

  renderMultiSelects = (item, classes, index) => {
    const { onChange, errors, t } = this.props;
    const classDefault = clsx(item.classCustom, classes.fpbField);
    // Pass errors to multi select
    const inputItem = {
      ...item,
      errors: (errors && !!errors[item.fieldName]) || false,
    };

    return (
      <React.Fragment key={index}>
        {!item.hidden && (
          <FormControl
            className={`${classDefault} ${
              classes[item.className]
            } field-wrapper`}
            variant="outlined"
            error={inputItem.errors}
          >
            <InputLabel
              required={inputItem.required}
              htmlFor={inputItem.id}
              shrink={true}
              classes={{
                root: classes.labelRoot,
                focused: classes.labelFocused,
              }}
            >
              {t(inputItem.label)}
            </InputLabel>
            <MultiSelect
              item={inputItem}
              onChange={(event, value) =>
                onChange({
                  target: {
                    value,
                    name: inputItem.fieldName,
                    customOnChange: inputItem.customOnChange,
                  },
                })
              }
            />
            {errors && (
              <FormHelperText>
                {inputItem.errors && errors[inputItem.fieldName].message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      </React.Fragment>
    );
  };

  renderCheckbox = (item, classes, index) => {
    const { t, onChange } = this.props;
    const { classCustom } = item;
    return (
      <div
        className={`field-wrapper checkbox ${classCustom} ${classes.checkbox}`}
        key={index}
      >
        <Checkbox
          checked={!!item.value || false}
          onChange={(e, value) => {
            onChange({
              target: {
                value: e.target.checked,
                name: item.fieldName,
                customOnChange: item.customOnChange,
              },
            });
          }}
          disabled={item.disabled || false}
          id={item.id}
          className="checkbox-icon"
        />
        <InputLabel
          htmlFor={item.id}
          shrink={true}
          className={`MuiFormLabel-root checkbox-label ${classes.labelCheckbox} ${item.id}`}
        >
          {item.label && t(item.label)}
        </InputLabel>
      </div>
    );
  };

  renderUploadFields = (item, classes, index) => {
    const { onChange } = this.props;
    const { classCustom } = item;
    return (
      <div
        className={`${classes.textLabelField} ${classCustom} Field-textLabelField field-wrapper `}
        key={index}
      >
        <UploadFile configUpload={item} onChange={onChange} />
      </div>
    );
  };

  renderTextArea = (item, classes, index) => {
    const { onChange, errors } = this.props;
    const value = item.value || '';
    const label = item.label || '';
    // Check Range Input case
    const errorFieldName = !item.match ? item.fieldName : item.match;

    return (
      <FormControl
        key={index}
        className={`${classes.txtAreaFld} ${classes[item.className]} ${
          item.classCustom
        } field-wrapper`}
        error={errors ? !!errors[errorFieldName] : false}
      >
        {label && (
          <div className={classes.textAreaLabel}>
            <InputLabel
              required={item.required}
              htmlFor={item.id}
              shrink={true}
              classes={{
                root: classes.labelRoot,
                focused: classes.labelFocused,
              }}
            >
              {label}
            </InputLabel>
          </div>
        )}
        <TextareaAutosize
          key={index}
          id={item.id}
          name={item.fieldName}
          value={value}
          placeholder={
            item.noPlaceHolder ? '' : item.placeHolder || 'Input Textarea'
          }
          defaultValue={item.defaultValue}
          maxLength={item.maxLength}
          rowsMax={item.rowsMax || 4}
          rowsMin={item.rowsMin || 1}
          onChange={(e) =>
            onChange({
              target: {
                value: e.target.value,
                name: item.fieldName,
              },
            })
          }
        />
        {/* Set error message */}
        {errors && (
          <FormHelperText>
            {errors[errorFieldName] && errors[errorFieldName].message}
          </FormHelperText>
        )}
      </FormControl>
    );
  };

  render() {
    const { classes, conditionalArray } = this.props;

    return (
      <div className={classes.fpbContainer}>
        {conditionalArray.map(
          (item, index) =>
            (item.fieldType !== FieldConstant.type.NONE &&
              this.renderFieldType(item, classes, index)) || (
              <div className={`field-wrapper field-none-content ${item.classCustom ? item.classCustom: ''}`} key={index} />
            )
        )}
      </div>
    );
  }
}

Field.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  className: PropTypes.string,
  classCustom: PropTypes.string,
  conditionalArray: PropTypes.array,
  onChange: PropTypes.func,
  errors: PropTypes.any,
  onKeyPress: PropTypes.func,
};

export default withTranslation()(withStyles(useStyles)(Field));
