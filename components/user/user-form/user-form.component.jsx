import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../../shared/page-header/page-header.component';
import PropTypes from 'prop-types';
import Fieldset from '../../shared/fieldset/fieldset.component';
import { withStyles } from '@material-ui/styles';
import useStyles from './user-form.style';
import FormLabelFields from '../../shared/form/detail-form/form-label-fields.component';
import Button from '../../shared/buttons/button.component';
import Fields from '../../shared/fields/fields.component';
// import { connect } from 'react-redux';
// import { ActionType } from '../../../constants/constants';
import { onChangeInput } from '../../../util/form-util';
// import { withRouter } from 'react-router-dom';
import {
  getBranch,
  getUserById,
} from '../../../actions/user-action';
import {
  formatDropdownList,
} from '../../../util/format-util';
import {
  addEditPersonalField,
  fieldsPersonalLabelArray,
  fieldsAccountLabelArray,
  bottomGridButtonsArray,
  validation
} from './user-form.config';

function UserForm(props) {
  const { classes, isDetailsPage, isEditPage, history } = props;
  const [userCode, setUserCode] = useState('');
  const [userId, setUserId ] = useState({});
  const [addFieldArray, setAddFieldArray] = useState(addEditPersonalField(isEditPage));
  const [dataDetail, setDataDetail] = useState({});
  const { handleSubmit, errors, register, setValue, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });

  // Load data for edit and detail screen
  const loadUserInformation = useCallback(
    () => {
      getUserById(userId).then(
        res => {
          if (res && res.status === '200') {
            setUserCode(res.data.userCode);
            setUserId(res.data.userId);
            isDetailsPage && setDataDetail(res.data);
            if (isEditPage) {
              const newState = addFieldArray.map((field) => {
                // Set value to validate
                field.fieldName && setValue(field.fieldName, res.data[field.fieldName]);
                return {
                  ...field,
                  value: res.data[field.fieldName],
                };
              });
              setAddFieldArray(newState);
            }
          }
        }
      );
    },[userId,isDetailsPage, isEditPage]);

  useEffect(() => {
    loadUserInformation();
  },[loadUserInformation]);

  useEffect(() => {
    // Get combobox data and reload into state
    !isDetailsPage && Promise.all([
      getBranch(),
    ]).then((res) => {
      setAddFieldArray((oldState) => {
        const data = [...oldState];
        // Data for Branch
        data.find((obj) => obj.fieldName === 'branchCode')['data'] = formatDropdownList(res[0].data);

        // Data for Department
        data.find((obj) => obj.fieldName === 'departmentCode')['data'] = formatDropdownList(res[0].data);

        // Data for Role
        data.find((obj) => obj.fieldName === 'role')['data'] = formatDropdownList(res[0].data);

        // Data for Account Status
        data.find((obj) => obj.fieldName === 'accountStatus')['data'] = formatDropdownList(res[0].data);

        clearErrors();
        return [...data];
      });
    });

    if (validation) {
      validation.forEach(valid => register(valid.name, valid.rule));
    }

  }, [clearErrors, register, isDetailsPage]);

  const mapInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      result[el.fieldName] = typeof el.value === 'string' ? el.value.trim() : el.value;
    });
    return result;
  };

  // Save data
  const onSave = () => {
    const information = mapInformationForSaving(
      addFieldArray
    );
    console.log(information);
  };

  // Move to Edit screen
  const onEdit = () => {
    history.push(`/account/user-list/edit/${userId}`);
  };

  const convertField =(fields,start,end) => fields.slice(start,end);

  // Render field in Add/Edit/View screen
  const renderInformation = (detailData, detailArray, addEditArray) => {
    if(isDetailsPage) {
      return (
        <FormLabelFields
          classFormFieldCustom="personal-information-form"
          fieldsLabelArray={detailArray(detailData)}
        />
      );
    }
    // setAddFieldArray(fieldArray);
    return (
      <Fields
        conditionalArray={addEditArray}
        onChange={(e) => onChange(e)}
        errors={errors}
      />
    );
  };

  const onChange = (e) => {
    const newFieldArray = onChangeInput(addFieldArray, e);
    // Set new value to validate
    setValue(e.target.name, e.target.value);
    // Clear error when have data
    clearErrors(e.target.name);
    // Set new display value
    setAddFieldArray(newFieldArray);
    // Field can have its own on change handler
    if (e.target.customOnChange) {
      e.target.customOnChange(e, newFieldArray);
    }
  };

  const renderBottomGridButtons = () => {
    let buttons = {};
    
    buttons =
          bottomGridButtonsArray() &&
          bottomGridButtonsArray(onEdit, isDetailsPage).map((item, index) => (
            <Button
              key={index}
              type={isDetailsPage ? 'button' : 'submit'}
              title={item.title}
              className={item.className}
              classCustom={item.classCustom}
              handleClick={item.handleClick}
              hidden={item.hidden}
            />
          ));
    
    return buttons;
  };

  let title = 'Create User';
  if (isEditPage) {
    title = `Edit User ${userCode ? `<${userCode}>` : ''}`;
  } else if (isDetailsPage) {
    title = `View User  ${
      userCode ? `<${userCode}>` : ''
    }`;
  }
        
  const pageHeader = {
    pageTitle: title,
    showButton: false,
  };
  return (
    <>
      <div>
        <PageHeader {...pageHeader}/>
      </div>
      <div className={classes.userForm}>
        <form
          onSubmit={handleSubmit(() => {
            onSave();
          })}
          noValidate
        >
          <Fieldset
            title={'Personal Information'}
            customClasses={`${isDetailsPage ? 'detail-general-info' : 'user-search-bar'}`}
          >
            {addFieldArray && renderInformation(dataDetail, fieldsPersonalLabelArray, convertField(addFieldArray, 0, 12))}
          </Fieldset>
          <Fieldset
            title={'Account Information'}
            customClasses={`${isDetailsPage ? 'detail-general-info' : 'user-search-bar'}`}
          >
            {addFieldArray && renderInformation(dataDetail, fieldsAccountLabelArray, convertField(addFieldArray, 12))}
          </Fieldset>
          <div className={classes.bottomGridBtn}>
            {renderBottomGridButtons()}
          </div>
        </form>
      </div>
    </>
  );
}

UserForm.propTypes = {
  isEditPage: PropTypes.bool,
  isDetailsPage: PropTypes.bool,
  classes: PropTypes.any,
  match: PropTypes.object,
  history: PropTypes.object,
  errors: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  setValue: PropTypes.any,
  setError: PropTypes.func,
  clearErrors: PropTypes.func,
  fieldArray: PropTypes.any,
};

export default withStyles(useStyles)(UserForm);