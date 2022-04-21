import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Fields from '../../fields/fields.component';
import useStyle from './form-label-fields.style';

function FormLabelFields(props) {
  const { fieldsLabelArray, classFormFieldCustom, classes } = props;

  const renderLabelFields = () => (
    <Fields conditionalArray={fieldsLabelArray} />
  );

  return (
    <div
      className={`${classes.root} ${classFormFieldCustom} form-field-label label-form`}
    >
      {renderLabelFields()}
    </div>
  );
}

FormLabelFields.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
  fieldsLabelArray: PropTypes.any,
  rowSize: PropTypes.number,
  classFormFieldCustom: PropTypes.string,
};

export default withStyles(useStyle)(FormLabelFields);
