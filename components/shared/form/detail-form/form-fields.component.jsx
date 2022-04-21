import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Fields from '../../fields/fields.component';
import { onChangeInput } from '../../../../util/form-util';
import { ActionType, FieldConstant } from '../../../../constants/constants';
import { withStyles } from '@material-ui/core';

import useStyles from '../../../shared/search-form/search-form.style';

class FormFields extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.classes = {};
    this.rowSize = this.props.rowSize;
    this.updateStateFieldArray = this.props.updateStateFieldArray;
  }

  renderFields = () => {
    const array = [];
    let index = 0;

    // Check to separate fields which have separateInOnline is true
    this.props.fieldArray &&
      this.props.fieldArray.forEach((el) => {
        if (el.separateInOneLine) {
          array[index] = [el];
          index++;
        } else {
          if (!array[index]) {
            array[index] = [el];
          } else {
            array[index].push(el);
          }
        }
      });

    // Return row
    return array.map((item, index) => (
      <Fields
        key={index}
        conditionalArray={item}
        onChange={(e, value) => this.onChange(e, value)}
        errors={this.props.errors}
      />
    ));
  };

  onChange = (e, value) => {
    // Handle onChange on quantity field
    if (e.fieldType === FieldConstant.type.QUANTITY) {
      const newEvent = {
        target: {
          value: value,
          name: e.fieldName,
        },
      };
      const newFieldArray = onChangeInput(this.props.fieldArray, newEvent);
      this.updateStateFieldArray(newFieldArray);
      this.props.setValue(newEvent.target.name, newEvent.target.value);
      this.props.clearErrors(newEvent.target.name);
      this.props.onFormFieldsChange(newFieldArray, newEvent.target.name);
    } else {
      const oldFieldArray = [...this.props.fieldArray];
      const newFieldArray = onChangeInput(this.props.fieldArray, e);
      this.updateStateFieldArray(newFieldArray);
      this.props.setValue(e.target.name, e.target.value);
      this.props.clearErrors(e.target.name);
      this.props.onFormFieldsChange(newFieldArray, e.target.name);

      // Field can have its own on change handler
      if (e.target.customOnChange) {
        e.target.setError = this.props.setError;
        e.target.clearErrors = this.props.clearErrors;
        e.target.customOnChange(e, newFieldArray, oldFieldArray);
      }
    }
  };

  render() {
    const fieldArr = Array.isArray(this.props.fieldArray)
      ? [...this.props.fieldArray]
      : [];
    // Update fieldArray for detail-form
    this.props.onFormFieldsChange(fieldArr);
    fieldArr.forEach((field) => {
      if (field.fieldName === 'qty') {
        this.props.setValue(
          field.searchInput.fieldName,
          field.searchInput.value
        );
      } else if ({}.hasOwnProperty.call(field, 'value')) {
        this.props.setValue(field.fieldName, field.value);
      }
    });
    const { classes } = this.props;
    return (
      <div
        className={`${this.classes.formFields || ''} form-fields ${
          classes.searchForm
        }`}
        id="form-fields"
      >
        {this.renderFields()}
      </div>
    );
  }
}

FormFields.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  errors: PropTypes.any,
  fieldArray: PropTypes.any,
  classCustom: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  validation: PropTypes.array,
  rowSize: PropTypes.number,
  updateStateFieldArray: PropTypes.any,
  setValue: PropTypes.any,
  onFormFieldsChange: PropTypes.func,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  fieldArray: state.detailFormStore.fieldArray,
});
const mapDispatchToProps = (dispatch) => ({
  updateStateFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_ALL_FIELD_ARRAY,
      fieldArray: data,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(FormFields));
