import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { getUserRole, updateUserRole } from '../../../actions/user-role-action';
import UserRoleForm from '../user-role-form/UserRoleForm';

function UserRoleEdit(props) {
  const [userRoleInfo, setUserRoleInfo] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const roleId = get(props, 'match.params.id');
    if (!roleId) {
      props.history.push('/user-role');
      return;
    }

    getUserRole({ id: roleId }).then(res => {
      setUserRoleInfo(res.data);
    });
  }, []);

  const editUserRole = (values, operationIds) => {
    const body = {
      roleId: userRoleInfo.roleId,
      roleName: values.roleName,
      description: values.description,
      roleItemList: map(operationIds, operationId => ({
        roleId: userRoleInfo.roleId,
        operationId,
      })),
    };

    updateUserRole(body).then(res => {
      if (res.status === '200') {
        props.history.push('/user-role');
      }
    });
  };

  return (
    <>
      <div className="subtitle">{`${t('Edit User Role')} - ${get(
        props,
        'match.params.id'
      )}`}</div>
      <UserRoleForm onSubmit={editUserRole} userRoleInfo={userRoleInfo} />
    </>
  );
}

UserRoleEdit.propTypes = {
  history: PropTypes.object,
};

export default UserRoleEdit;
