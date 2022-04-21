import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';

import useStyles from '../../../style/core/search/search';

import Fields from '../fields/fields.component';
import { onChangeInput, getStateFields } from '../../../util/form-util';
import { FieldConstant } from '../../../constants/constants';

function useOnMount(handler) {
  return React.useEffect(handler, [handler]);
}

const AddForm = (props, ref) => {
  const {
    allowDefaultClass = true,
    addFieldArray, // Array config to render fields
    validation, // Object config validation rule
    onFormFieldsChange,
    register,
    errors,
    setValue,
    clearErrors,
  } = props;

  const classes = useStyles();

  const defaultClass = allowDefaultClass
    ? `form-fields ${classes.searchForm}`
    : '';

  const [fields, setFields] = useState(addFieldArray);
  const [inputValue, setInputValue] = useState();
  const [debouncedBOMGroupHeaders] = useDebounce(inputValue, 200);

  useOnMount(() => {
    if (validation) {
      validation.forEach((valid) => register(valid.name, valid.rule));
    }
  });

  useEffect(() => {
    addFieldArray.forEach((field) => {
      field.fieldName && setValue(field.fieldName, field.value);
    });
    setFields(addFieldArray);
  }, [addFieldArray, setValue]);

  const onChange = (e, value) => {
    // Handle onChange on quantity field
    if (e.fieldType === FieldConstant.type.QUANTITY) {
      const newEvent = {
        target: {
          value: value,
          name: e.fieldName,
        },
      };
      const newFieldArray = onChangeInput(fields, newEvent);
      // Set new value to validate
      setValue(newEvent.target.name, newEvent.target.value);
      clearErrors(newEvent.target.name);

      // Set new display value
      setFields(newFieldArray);

      // Store latest fields to debounce
      setInputValue(getStateFields(newFieldArray));
    } else {
      const newFieldArray = onChangeInput(fields, e);
      // Set new value to validate
      setValue(e.target.name, e.target.value);
      clearErrors(e.target.name);

      // Set new display value
      setFields(newFieldArray);

      // Store latest fields to debounce
      setInputValue(getStateFields(newFieldArray));

      // Field can have its own on change handler
      if (e.target.customOnChange) {
        e.target.customOnChange(e, newFieldArray);
      }
    }
  };

  useEffect(() => {
    onFormFieldsChange(debouncedBOMGroupHeaders);
  }, [debouncedBOMGroupHeaders, onFormFieldsChange]);

  const clearDateRangeInput = (item) => {
    const { value } = item;

    if (value) {
      value.ge = null;
      value.le = null;
    }
  };

  const clearFields = () => {
    setFields((prevState) => {
      const newState = [...prevState];
      newState.forEach((field, index) => {
        if (
          field.fieldType === FieldConstant.type.RANGE_INPUT &&
          field.inputType === 'date'
        ) {
          clearDateRangeInput(newState[index]);
        } else {
          newState[index].value = undefined;
        }
        setValue(newState[index].fieldName, newState[index].value);
      });

      return newState;
    });
  };

  useEffect(
    () => () => {
      clearErrors();
    },
    [clearErrors]
  );

  useImperativeHandle(ref, () => ({
    clearFields,
  }));

  const renderFields = () => {
    const array = [];
    let index = 0;

    // Check to separate fields which have separateInOnline is true
    fields.forEach((el) => {
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
        onChange={(e, value) => onChange(e, value)}
        errors={errors}
      />
    ));
  };

  return <div className={defaultClass}>{renderFields()}</div>;
};

AddForm.propTypes = {
  allowDefaultClass: PropTypes.string,
  t: PropTypes.any,
  i18n: PropTypes.any,
  addFieldArray: PropTypes.array,
  validation: PropTypes.array,
  rowSize: PropTypes.number,
  onFormFieldsChange: PropTypes.func,
  handleSubmit: PropTypes.any,
  errors: PropTypes.any,
  register: PropTypes.any,
  setValue: PropTypes.any,
  clearErrors: PropTypes.any,
};

export default forwardRef(AddForm);
