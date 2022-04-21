import React from 'react';
import {
  FieldConstant,
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';

// Add/Edit in Personal Information
const addEditPersonalField = (isEditPage) => [
  {
    label: 'First Name',
    id: 'firstName',
    fieldName: 'firstName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Last Name',
    id: 'lastName',
    fieldName: 'lastName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Email',
    id: 'email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Telephone',
    id: 'telephone',
    fieldName: 'telephone',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
  },
  {
    label: 'Address',
    id: 'address',
    fieldName: 'address',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Department',
    id: 'departmentCode',
    fieldName: 'departmentCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
  },
  {
    label: 'Position',
    id: 'positionCode',
    fieldName: 'positionCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Division',
    id: 'divisionCode',
    fieldName: 'divisionCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Employee ID',
    id: 'employeeID',
    fieldName: 'employeeID',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    label: 'Username',
    id: 'username',
    fieldName: 'username',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    disabled: isEditPage
  },
  {
    label: 'Role',
    id: 'role',
    fieldName: 'role',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
  },
  {
    label: 'Account Status',
    id: 'accountStatus',
    fieldName: 'accountStatus',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
  },
  {
    label: 'Assigned Role',
    id: 'assignedRole',
    fieldName: 'assignedRole',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: true
  },
];

const validation = [
  {
    name: 'firstName',
    rule: {
      required: `First Name ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'lastName',
    rule: {
      required: `Last Name ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'email',
    rule: {
      required: `Email ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'telephone',
    rule: {
      required: `Telephone ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'branchCode',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'address',
    rule: {
      required: `Address ${Message.FIELD_REQUIRED}`,
    },
  }, 
  {
    name: 'departmentCode',
    rule: {
      required: `Department ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'positionCode',
    rule: {
      required: `Position ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'divisionCode',
    rule: {
      required: `Division ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'employeeID',
    rule: {
      required: `Employee ID ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'username',
    rule: {
      required: `Username ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'role',
    rule: {
      required: `Role ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'accountStatus',
    rule: {
      required: `Account Status ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Detail for Personal Information
const fieldsPersonalLabelArray = detailData => [
  {
    label: 'First Name',
    fieldName: 'firstName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.firstName) || '',
  },
  {
    label: 'Last Name',
    fieldName: 'lastName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.lastName) || '',
  },
  {
    label: 'Address',
    fieldName: 'address',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.address) || '',
  },
  {
    label: 'Email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.email) || '',
  },
  {
    label: 'Department',
    fieldName: 'departmentName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.departmentName) || '',
  },
  {
    label: 'Telephone',
    fieldName: 'telephone',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.telephone) || '',
  },
  {
    label: 'Position',
    fieldName: 'position',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.position) || '',
  },
  {
    label: 'Branch',
    fieldName: 'branchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.branchName) || '',
  },
  {
    label: 'Division',
    fieldName: 'division',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.division) || '',
  },
  {
    label: 'Employee ID',
    fieldName: 'employeeID',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.employeeID) || '',
  },
];

// Detail for Account Information
const fieldsAccountLabelArray = detailData => [
  {
    label: 'Username',
    fieldName: 'username',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.username) || '',
  },
  {
    label: 'Role',
    fieldName: 'role',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.role) || '',
  },
  {
    label: 'Assigned Role',
    fieldName: 'assignedRole',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.assignedRole) || '',
  },
  {
    label: 'Account Status',
    fieldName: 'accountStatus',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.accountStatus) || '',
  },
];

const bottomGridButtonsArray = (onEdit, isDetailsPage) => [
  {
    title: 'Save',
    handleFor: 'save',
    className: 'btnSecondary',
    // handleClick: onSave,
    hidden: isDetailsPage
  },
  {
    title: 'Edit',
    handleFor: 'edit',
    className: 'btnSecondary',
    handleClick: onEdit,
    hidden: !isDetailsPage
  },
];

export {
  addEditPersonalField,
  // addEditAccountField,
  validation,
  fieldsPersonalLabelArray,
  fieldsAccountLabelArray,
  bottomGridButtonsArray
};
