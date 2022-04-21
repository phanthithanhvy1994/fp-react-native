import React from 'react';
import { Edit } from '@material-ui/icons';

import Fields from '../../../shared/fields/fields.component';
import { calculateExVat } from '../branch-bom-price.util';

import { FieldConstant } from '../../../../constants/constants';
import { formatPrice } from '../../../../util/format-util';
import { valueTaxCodes } from './price-edit/price-edit.config';


const renderPriceField = (props) => {
  const fields = [
    {
      label: '',
      fieldName: 'price',
      fieldType: FieldConstant.type.QUANTITY,
      className: FieldConstant.class.QUANTITY,
      value: props.rowData.price || '',
      maximumValue: 999999999,
      minimumValue: 0,
      numberDecimalCharacter: 0,
    },
  ];

  return (
    <Fields
      conditionalArray={fields}
      onChange={(item, value) => props.onChange(value)}
    />
  );
};



const renderTaxCodeField = (props, taxCode) => {
  const fields = [
    {
      label: '',
      fieldName: 'taxCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      value: props?.value || valueTaxCodes.O7,
      data: taxCode || [],
    },
  ];

  return (
    <Fields
      conditionalArray={fields}
      onChange={(item, value) =>  {
        props.onChange(item.target.value);
      }}
    />
  );
};

const priceColumns = (taxCodes) =>
  [
    {
      title: 'Branch BOM Code',
      field: 'itemCode',
      defaultSort: 'asc',
      editable: 'never',
      width: 'calc(13%)',
      render: function customRender(data) {
        return data.itemCode || data.bomBranchCode;
      }
    },
    {
      title: 'Branch BOM Name',
      field: 'itemName',
      editable: 'never',
      width: 'calc(13%)',
      render: function customRender(data) {
        return data.itemName || data.bomBranchName;
      }
    },
    {
      title: 'Level',
      field: 'level',
      editable: 'never',
      width: 'calc(3%)',
    },
    {
      title: 'Price',
      field: 'price',
      width: 'calc(15%)',
      render: (rowData) => {
        return (rowData.price && formatPrice(+rowData.price)) || '';
      },
      editComponent: (props) => renderPriceField(props),
    },
    {
      title: 'Tax Code',
      field: 'taxCode',
      // editable: 'never',
      width: 'calc(10%)',
      render: (rowData) => {
        return rowData.taxCode || valueTaxCodes.O7;
      },
      editComponent: (props) => renderTaxCodeField(props, taxCodes),
    },
    {
      title: 'EX VAT',
      field: 'exVat',
      editable: 'never',
      width: 'calc(10%)',
      render: (rowData) =>
        rowData.taxCode !== valueTaxCodes.OX ? calculateExVat(rowData.price || 0) : '',
    },
    {
      title: 'Category Name',
      field: 'categoryName',
      editable: 'never',
      width: 'calc(17%)',
    },
    { title: 'Note', field: 'description' },
  ];

const exportConfigs = {
  fileName: 'Price_List_Items',
  headers: [
    'Branch BOM Code',
    'Branch BOM Name',
    'Sub BOM Code',
    'Sub BOM Name',
    'Level',
    'Indicator',
    'Price',
    'Tax Code',
    'Category',
  ],
  unusedFields: ['Description'],
  isFontAwesome: true
};

const icons = {
  edit: <Edit />,
};

const actions = (customEdit) => [
  {
    icon: () => icons.edit,
    tooltip: 'BOM Price Edit',
    onClick: (event, rowData) => {
      customEdit(rowData);
    },
    position: 'row',
    hiddenFunc: (data) =>{
      return +data.level !== 1;
    }
  },
  {
    icon: () => {},
    tooltip: 'Remove',
    isFreeAction: true,
    onClick: () => {},
    position: 'toolbarOnSelect'
  },
  {
    icon: () => {},
    tooltip: 'Add Items',
    isFreeAction: true,
    isAddItemsPopup: true,
    onClick: () => {},
    position: 'toolbarOnSelect'
  },
];

export { priceColumns, exportConfigs, actions };
