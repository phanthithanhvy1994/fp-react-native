import React from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { addUserRole } from '../../../actions/user-role-action';
import UserRoleForm from '../user-role-form/UserRoleForm';

function UserRoleAdd(props) {
  const { t } = useTranslation();

  const saveUserRole = (values, operationIds) => {
    const body = {
      roleName: values.roleName,
      description: values.description,
      roleItemList: map(operationIds, operationId => ({
        roleId: '',
        operationId,
      })),
    };

    addUserRole(body).then(res => {
      if (res.status === '200') {
        props.history.push('/user-role');
      }
    });
  };

  return (
    <>
      <div className="subtitle">{t('Create User Role')}</div>
      <UserRoleForm onSubmit={saveUserRole} />
    </>
  );
}

UserRoleAdd.propTypes = {
  history: PropTypes.object,
};

export default UserRoleAdd;
