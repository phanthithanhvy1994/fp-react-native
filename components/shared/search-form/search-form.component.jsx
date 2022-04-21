import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import collapseUp from '../../../assets/collapseUp.svg';
import collapseDown from '../../../assets/collapseDown.svg';

import Fields from '../fields/fields.component';
import Button from '../buttons/button.component';
import { onChangeInput, getStateFields } from '../../../util/form-util';
import { ButtonConstant, FieldConstant } from '../../../constants/constants';
import useStyles from '../../../style/core/search/search';

function useOnMount(handler) {
  return React.useEffect(handler, [handler]);
}

function SearchForm(props) {
  const {
    fieldArray, // Array config to render fields
    classCustom, // Class name override css
    validation, // Object config validation rule
    onSearch, // Search function
    isAddItemsForm,
    onClearCustom,
    getCollapsedState
  } = props;

  const { handleSubmit, register, errors, setValue } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });

  const { t } = useTranslation();

  const [isCollapse, setCollapse] = React.useState(true);

  const [fields, setFields] = useState(fieldArray);

  const classes = useStyles();

  const classDefault = clsx(classCustom, classes.fpbForm);

  useOnMount(() => {
    if (validation) {
      validation.forEach((valid) => register(valid.name, valid.rule));
    }
  });

  // Fix issue not update new value
  useEffect(() => {
    setFields(fieldArray);
  }, [fieldArray]);

  const onChange = (e) => {
    const newFieldArray = onChangeInput(fields, e);
    // Set new value to validate
    setValue(e.target.name, e.target.value);

    // Set new display value
    setFields(newFieldArray);

    // Field can have its own on change handler
    if (e.target.customOnChange) {
      e.target.customOnChange(e, newFieldArray);
    }
  };

  const clearDateRangeInput = (item) => {
    const { value } = item;

    if (value) {
      value.ge = null;
      value.le = null;
    }
  };

  const onClearFields = () => {
    const tempFieldArray = [...fieldArray];
    tempFieldArray.forEach((item, index) => {
      // Handle custom onchange event
      if (item.customOnChange) {
        const e = {
          target: {
            value: '',
          },
        };
        item.customOnChange(e);
      }
      // Reset date range input
      if (
        (item.fieldType === FieldConstant.type.RANGE_INPUT ||
          item.fieldType === FieldConstant.type.PICKER) &&
        item.inputType === 'date'
      ) {
        if (item.initialValue) {
          item.value = item.initialValue;
        } else {
          clearDateRangeInput(tempFieldArray[index]);
        }
      } else {
        //Reset
        let resetValue;
        // Using spread operator to not keep the reference
        if (Array.isArray(item.resetValue)) {
          resetValue = [...item.resetValue];
        } else if (typeof item.resetValue === 'object') {
          resetValue = { ...item.resetValue };
        } else {
          resetValue = item.resetValue;
        }
        tempFieldArray[index].value = resetValue || '';
      }
    });
    setFields(tempFieldArray);
  };

  const handleSearch = () => {
    const stateFields = getStateFields(fields);
    onSearch(stateFields);
  };

  const handleCollsape = () => {
    setCollapse(!isCollapse);
    getCollapsedState && getCollapsedState(isCollapse);
  };

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
        onChange={(e) => onChange(e)}
        errors={errors}
      />
    ));
  };

  return (
    <form
      className={classDefault}
      onSubmit={handleSubmit(handleSearch)}
      noValidate
    >
      {isCollapse && (
        <div
          className={`${
            isAddItemsForm ? 'add-items-form' : `${classes.searchForm}`
          }`}
        >
          {renderFields()}
        </div>
      )}
      <div className={isCollapse ? classes.formAction : classes.formActionCol}>
        {isCollapse ? (
          <div className={[isCollapse ? classes.collapse : '']}>
            <Button
              handleClick={onClearCustom ? onClearCustom : onClearFields}
              className={ButtonConstant.type.NEUTRAL}
              isFontAwesome={false}
              title={t('Clear')}
              disabled={false}
              classCustom={classes.btnClear}
            />
            <Button
              type="submit"
              className={ButtonConstant.type.PRIMARY}
              isFontAwesome={false}
              title={t('Search')}
              disabled={false}
              classCustom={classes.btnSearch}
            />
          </div>
        ) : (
          <div>
            <span className={classes.spanSearch}>{t('Search Area')}</span>
          </div>
        )}
        <div className={classes.btnColl}>
          <Button
            handleClick={handleCollsape}
            iconImg={isCollapse ? collapseUp : collapseDown}
            disabled={false}
            classCustom={classes.btnCollapse}
          />
        </div>
      </div>
    </form>
  );
}

SearchForm.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  fieldArray: PropTypes.array,
  classCustom: PropTypes.string,
  onSearch: PropTypes.func,
  onClearCustom: PropTypes.func,
  validation: PropTypes.array,
  rowSize: PropTypes.number,
  isAddItemsForm: PropTypes.any,
  getCollapsedState: PropTypes.func,
};

export default SearchForm;
