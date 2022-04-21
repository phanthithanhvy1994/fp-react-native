import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {
  FieldConstant,
  dateFormat,
  BranchBOM
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { formatDateString } from '../../../../util/date-util';
import ItemGrid from '../../../shared/table-grid/item-grid.component';
import NoImage from '../../../../assets/no-image.png';

const getFields = (
  // onOrderTypeChange,
  // isEditPage,
  res,
  levels,
) => {
  return [
    {
      label: 'Branch BOM Group Code',
      id: 'bomGroupCode',
      fieldName: 'bomGroupCode',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: false,
      disabled: true,
      value: res?.bomGroupCode,
    },
    {
      label: 'Name',
      id: 'bomGroupName',
      fieldName: 'bomGroupName',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      value: res?.bomGroupName,
    },
    {
      label: 'Level',
      id: 'level',
      fieldName: 'level',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      // customOnChange: onOrderTypeChange,
      data: levels || [],
      disabled: true,
      value: res?.level,
    },
  ];
};

const getFieldsTextOnly = (data) => [
  {
    label: 'Branch BOM Group Code',
    fieldName: 'bomGroupCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.bomGroupCode || '',
  },
  {
    label: 'Name',
    fieldName: 'bomBranchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.bomGroupName || '',
  },
  {
    label: 'Level',
    fieldName: 'level',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.level || '',
  },
];

const validation = () => [
  {
    name: 'bomGroupName',
    rule: {
      required: `Branch Group Name ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'level',
    rule: {
      required: `Level ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Columns in detail grid
const columnsDetail = (isDetailsPage) => {
  return [
    {
      title: 'No',
      field: 'no',
      defaultSort: 'asc',
      width: 80,
      headerStyle: {
        textAlign: 'center',
      },
      cellStyle: {
        textAlign: 'center',
        fontSize: '12px',
      },
    },
    {
      title: 'Item',
      field: 'itemName',
      headerStyle: {
        textAlign: 'left',
      },
      cellStyle: {
        textAlign: 'left',
        fontSize: '12px',
      },
      render: (rowData) => {
        const infoList = [
          {
            fieldName: 'bomBranchCode',
            label: 'Branch BOM Code',
            alternativeFieldName: 'itemCode',
          },
          { fieldName: 'bomBranchName', label: 'Name' },
          { fieldName: 'productUnit', label: 'Unit' },
          { fieldName: 'categoryName', label: 'Category' },
        ];
        if (isDetailsPage) {
          return (
            // <div>
            infoList.map((config) => (
              <div key={config.fieldName}>
                {config.label}:{' '}
                {rowData[config.fieldName] ||
                  rowData[config.alternativeFieldName]}
              </div>
            ))
            // </div>
          );
        } else {
          return (
            // <div>
            <ItemGrid image={NoImage}>
              {infoList.map((config) => (
                <div key={config.fieldName}>
                  {config.label}:{' '}
                  {rowData[config.fieldName] ||
                    rowData[config.alternativeFieldName]}
                </div>
              ))}
            </ItemGrid>
            // {/* </div> */}
          );
        }
      },
    },
    {
      title: 'Status',
      field: 'statusName',
      headerStyle: {
        textAlign: 'left',
      },
      cellStyle: {
        textAlign: 'left',
        fontSize: '12px',
      },
    },
    {
      title: 'Level',
      field: 'level',
      headerStyle: {
        textAlign: 'left',
      },
      cellStyle: {
        textAlign: 'left',
        fontSize: '12px',
      },
    },
    {
      title: 'Start Date',
      field: 'startDate',
      headerStyle: {
        textAlign: 'left',
      },
      cellStyle: {
        textAlign: 'left',
        fontSize: '12px',
      },
      render: (rowData) => {
        return formatDateString(rowData.startDate, dateFormat.mainDate, true);
      },
    },
    {
      title: 'End Date',
      field: 'endDate',
      headerStyle: {
        textAlign: 'left',
      },
      cellStyle: {
        textAlign: 'left',
        fontSize: '12px',
      },
      render: (rowData) => {
        return formatDateString(rowData.endDate, dateFormat.mainDate, true);
      },
    },
  ];
};

const options = (isDetailsPage) => ({
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: !isDetailsPage,
});

// Config for action in detail grid
const actions = ({ addBranchBomGroupHandler, isDetailsPage}) => [
  {
    icon: () => ({}),
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: isDetailsPage,
    onClick: () => {},
  },
  {
    icon: <AddIcon />,
    tooltip: 'Select Branch BOMs',
    isFreeAction: true,
    customHandler: addBranchBomGroupHandler,
    isAddItemsPopup: true,
    hidden: isDetailsPage,
    onClick: () => {},
  },
];

// Fields in search form on 'Add/Edit Popup' form
const addItemsFieldArray = () => [
  {
    label: 'Branch BOM Code',
    id: 'bomBranchCode',
    fieldName: 'bomBranchCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
  },
  {
    label: 'Branch BOM Name',
    id: 'bomBranchName',
    fieldName: 'bomBranchName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  // {
  //   label: 'Level',
  //   id: 'level',
  //   fieldName: 'level',
  //   fieldType: FieldConstant.type.MULTI_SELECT,
  //   className: FieldConstant.class.MULTI_SELECT,
  //   data: level || [],
  // },
];

// Fields in search form on 'Add/Edit' form
const addItemsFieldsGroup = (level, isEditPage, isDetailsPage) => [
  {
    label: 'Branch BOM Group Code',
    id: 'bomGroupCode',
    fieldName: 'bomGroupCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
    disabled: isDetailsPage || isEditPage,
  },
  {
    label: 'Name',
    id: 'bomGroupName',
    fieldName: 'bomGroupName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: level || [],
    disabled: isEditPage,
  },
];

const bottomGridButtons = (handleEdit, isDetailsPage, data) => [
  {
    title: 'Edit',
    className: 'btnFullWidth',
    handleClick: handleEdit,
    hidden: data.existed === BranchBOM.existsInBranchBom || !isDetailsPage,
    customHandleClick: true,
  },
];

//Fields for Branch BOM function Add/ Edit
const fieldsForm = {
  bomGroupCode: 'bomGroupCode',
  bomGroupName: 'bomGroupName',
  level: 'level',
};

// Information Display in popup Select Branch BOM Group
const informationConvert = [
  { label: 'bomBranchCode' },
  { label: 'bomBranchName' },
  { label: 'levelName' },
];

export {
  getFields,
  validation,
  columnsDetail,
  options,
  actions,
  addItemsFieldArray,
  fieldsForm,
  addItemsFieldsGroup,
  getFieldsTextOnly,
  bottomGridButtons,
  informationConvert,
};
