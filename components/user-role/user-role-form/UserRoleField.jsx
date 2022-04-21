import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useStyles from '../../../style/core/user-role/user-role-field';
import Fields from '../../shared/fields/fields.component';
import { onChangeInput } from '../../../util/form-util';

function UserRoleField(props) {
  const {
    fieldArray, // Array config to render fields
    errors,
    rowSize = 2, // Fields per row
  } = props;

  const [fields, setFields] = useState(fieldArray);
  const classes = useStyles();
  const onChange = e => {
    const newFieldArray = onChangeInput(fields, e);
    setFields(newFieldArray);
    props.onchange(newFieldArray);
  };

  const renderFields = () => {
    const array = [];
    // calculate field per row
    const noOfRows = Math.ceil(fields.length / rowSize);
    // Loop to get amount field per row
    while (array.length < noOfRows) {
      const startValue = array.length * rowSize;
      array.push(fields.slice(startValue, startValue + rowSize));
    }
    // Return row
    return array.map((item, index) => (
      <Fields
        key={index}
        conditionalArray={item}
        onChange={e => onChange(e)}
        errors={errors}
      />
    ));
  };

  return <div className={classes.userRoleField}>{renderFields()}</div>;
}

UserRoleField.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  errors: PropTypes.any,
  fieldArray: PropTypes.array,
  classCustom: PropTypes.string,
  onSearch: PropTypes.func,
  onchange: PropTypes.func,
  validation: PropTypes.array,
  rowSize: PropTypes.number,
};

export default UserRoleField;
