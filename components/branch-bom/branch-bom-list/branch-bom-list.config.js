import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { FieldConstant, dateFormat } from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';

// TODO: example fields
const columnsDefault = [
  {
    title: 'Status',
    field: 'statusName',
    width: 100,
  },
  {
    title: 'Item',
    field: 'bomBranchCode',
    render: (rowData) => {
      const infoList = [
        { fieldName: 'bomBranchCode', label: 'Branch BOM Code' },
        { fieldName: 'bomBranchName', label: 'Name' },
        { fieldName: 'productUnit', label: 'Unit' },
        { fieldName: 'categoryName', label: 'Category' },
      ];
      return (
        <div>
          {infoList.map((el) => (
            <div key={el.fieldName} className="branchBOM-link">
              {el.label}: {rowData[el.fieldName]}
            </div>
          ))}
        </div>
      );
    },
    cellStyle: {
      width: '20%',
      border: '1px solid rgb(196, 196, 196)',
    },
  },
  {
    title: 'Level',
    field: 'levelName',
  },
  {
    title: 'Product',
    field: 'productName',
  },
  {
    title: 'Price',
    field: 'priceName',
  },
  {
    title: 'Category',
    field: 'categoryName',
  },
  {
    title: 'Sub Category',
    field: 'subCategoryName',
  },
  {
    title: 'Start Date',
    field: 'startDate',
    render: (rowData) => {
      return formatDateString(rowData.startDate, dateFormat.mainDate, true);
    },
  },
  {
    title: 'End Date',
    field: 'endDate',
    render: (rowData) => {
      return formatDateString(rowData.endDate, dateFormat.mainDate, true);
    },
  },
];

const options = {
  search: false,
  draggable: false,
  toolbar: true,
  paging: false,
  exportButton: false,
  sorting: true,
  showTitle: false,
  selection: false,
};

const icons = {
  view: <VisibilityIcon />,
  delete: <Delete />,
  edit: <Edit />,
};

const actions = (
  goToDetailPage,
  goToEditPage,
  confirmDeleteItem,
  handleDisableActionButton
) => [
  {
    tooltip: 'View',
    icon: () => icons.view,
    onClick: (e, rowData) => {
      goToDetailPage(rowData.id);
    },
  },
  (data) => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData);
    },
    // Remove disabled edit icon
    // disabled: handleDisableActionButton(data, 'edit'),
  }),
  (data) => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: handleDisableActionButton(data, 'delete'),
  }),
];

const fields = (
  level,
  status,
  companyCode,
  product,
  price,
  subcategory,
  onChangeProduct
) => [
  {
    label: 'Brach BOM Code',
    id: 'bomBranchCode',
    fieldName: 'bomBranchCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
  },
  {
    // DOING: waiting API
    label: 'Company Code',
    id: 'company',
    fieldName: 'company',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: companyCode || [],
  },
  {
    // DOING: waiting API
    label: 'Product',
    id: 'product',
    fieldName: 'product',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    customOnChange: onChangeProduct,
    required: false,
    data: product || [],
  },
  {
    // DOING: waiting API
    label: 'Price',
    id: 'price',
    fieldName: 'price',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: price || [],
  },
  {
    // DOING: waiting API
    label: 'Category',
    id: 'category',
    fieldName: 'category',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    disabled: true,
    data: [],
  },
  {
    label: 'Sub Category',
    id: 'subCategory',
    fieldName: 'subCategory',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: subcategory || [],
  },
  {
    label: 'Branch BOM Name',
    id: 'bomBranchName',
    fieldName: 'bomBranchName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: level || [],
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: status || [],
  },
  {
    label: 'Start Date',
    id: 'startDate',
    fieldName: 'startDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {},
    searchInput: {
      label: 'Start Date',
      fieldName: 'startDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

export { columnsDefault, options, actions, fields };
