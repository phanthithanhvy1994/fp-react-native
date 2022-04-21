import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Fields from '../../fields/fields.component';
import FieldSet from '../../fieldset/fieldset.component';
import { onChangeInput } from '../../../../util/form-util';
import { ActionType, FieldConstant } from '../../../../constants/constants';
import { withStyles } from '@material-ui/core';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';

import useStyles from '../../../procurement/petty-cash/petty-cash-form/petty-cash-form.style';

class GenerelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioVendorValue: 'existedVendor'
    };
    this.classes = {};
    this.rowSize = this.props.rowSize;
    this.updateStateFieldArray = this.props.updateStateFieldArray;
  }

  renderFields = (fieldArr) => {
    return (
      <Fields
        conditionalArray={fieldArr}
        onChange={(e, value) => this.onChange(e, value)}
        errors={this.props.errors}
      />
    );
  };

  onChange = (e, value) => {
    if(e.target.name === 'vendor'){
      this.setState({
        radioVendorValue: value
      });
    }
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

  convertField =(fields,start,end) => fields.slice(start,end);

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
    const fields = this.props.fieldArray;
    const { radioVendorValue } = this.state;
    return (
      <div className={classes.generalform}>
        <div className={'topform'}>
          <div className={classes.leftForm} >
            {fields && this.renderFields(this.convertField(fields,0,4))}
          </div>
          <div className={classes.rightForm} >
            {fields && this.renderFields([fields[4]])}
          </div>
        </div>
        <div>
          <FormLabel className={classes.Radio} required={true}>
              Vender
          </FormLabel>
          <RadioGroup
            name='vendor'
            value={radioVendorValue}
            onChange={(e, value) => this.onChange(e, value)}
            className='btnRadio'>
            <FormControlLabel
              value={'existedVendor'}
              control={<Radio />}
              label={'Existed Vendor Name'}
            />
            { radioVendorValue === 'existedVendor' && fields && this.renderFields([fields[6]])}
            <FormControlLabel
              value={'newVendor'}
              control={<Radio />}
              label={'Create New Vendor'}
            />
          </RadioGroup>
        </div>
        {!(radioVendorValue === 'existedVendor') && (
          <FieldSet 
            title = 'Vendor Information'
          >
            { fields && this.renderFields(this.convertField(fields,7,16))}
          </FieldSet>
        )}
      </div>
    );
  }
}

GenerelForm.propTypes = {
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
)(withStyles(useStyles)(GenerelForm));

