import React, { useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import groupBy from 'lodash/groupBy';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import { useForm } from 'react-hook-form';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import UserRoleFeature from './UserRoleFeature';
import Button from '../../shared/buttons/button.component';
import { getUserRoleFeatures } from '../../../actions/user-role-action';
import { fields, validation } from './user-role-form.config';
import UserRoleField from './UserRoleField';
import useStyles from '../../../style/core/user-role/user-role-form';
import { deepCopy } from '../../../util/form-util';

function UserRoleForm(props) {
  const { handleSubmit, register, errors, setValue } = useForm({
    reValidateMode: 'onSubmit',
  });
  const classes = useStyles();
  const [userRoleFeatures, setUserRoleFeatures] = useState({});
  const [operationIds, setOperationIds] = useState([]);
  // deepCopy to avoid value storage
  const [userRoleFields, setUserRoleFields] = useState(deepCopy(fields));
  const [allFeatures, setAllFeatures] = useState([]);

  const { userRoleInfo } = props;
  const isEditMode = !isEmpty(userRoleInfo);

  useEffect(() => {
    getUserRoleFeatures({ channel: 0 }).then(res => {
      const roleFeatures = groupBy(res.data, item => item.moduleName);
      setAllFeatures(map(res.data, 'operationId'));
      setUserRoleFeatures(roleFeatures);
    });
    validation.forEach(valid => register(valid.name, valid.rule));
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const newUserRoleFields = map(userRoleFields, field => {
        const fieldCopy = field;
        fieldCopy.value = userRoleInfo[field.fieldName];
        setValue(fieldCopy.fieldName, fieldCopy.value);
        return fieldCopy;
      });
      setUserRoleFields(newUserRoleFields);

      const newOperationIds = map(
        userRoleInfo.roleItemList,
        role => role.operationId
      );
      setOperationIds(newOperationIds);
    }
  }, [userRoleInfo]);

  const handleCheckRoleFeature = (operationId, mode) => {
    if (mode === 'check-all') {
      const isCheckAll = operationId.length === 0;
      if (isCheckAll) {
        setOperationIds(allFeatures);
      } else {
        setOperationIds([]);
      }
      return;
    }

    const isCheckOperation = includes(operationIds, operationId);
    let newOperationIds = [];

    newOperationIds = isCheckOperation
      ? filter(operationIds, item => item !== operationId)
      : [operationId, ...operationIds];

    setOperationIds(newOperationIds);
  };

  const changeInput = values => {
    map(values, item => {
      setValue(item.fieldName, item.value);
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(values => props.onSubmit(values, operationIds))}
        noValidate
        className={classes.root}
      >
        <div className={classes.fields}>
          <UserRoleField
            fieldArray={userRoleFields}
            rowSize={2}
            onchange={changeInput}
            errors={errors}
          />
        </div>
        <div className={classes.feature}>
          <UserRoleFeature
            userRoleFeatures={userRoleFeatures}
            handleCheckRoleFeature={handleCheckRoleFeature}
            operationIds={operationIds}
            allFeatures={allFeatures}
          />
        </div>
        <div className={classes.btn}>
          <Button
            className="btnPrimary"
            title="Save"
            icon={<SaveIcon />}
            type="submit"
          />
        </div>
      </form>
    </>
  );
}

UserRoleForm.propTypes = {
  history: PropTypes.object,
  onSubmit: PropTypes.func,
  userRoleInfo: PropTypes.object,
};

export default UserRoleForm;
