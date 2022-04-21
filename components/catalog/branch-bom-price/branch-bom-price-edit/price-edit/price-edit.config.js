import React from 'react';

import { Input, InputAdornment } from '@material-ui/core';

import Fields from '../../../../shared/fields/fields.component';
import { FieldConstant, BranchBOMPrice } from '../../../../../constants/constants';

const customPriceField = (rowData, onFieldChange) => {
  const fields = [
    {
      id: rowData.sku,
      label: '',
      fieldName: 'price',
      fieldType: FieldConstant.type.QUANTITY,
      className: FieldConstant.class.QUANTITY,
      value: rowData.price || '',
      maximumValue: 999999999,
      minimumValue: 0,
      numberDecimalCharacter: 0,
    },
  ];

  return (
    <Fields
      conditionalArray={fields}
      onChange={(item, value) => onFieldChange(rowData, value)}
    />
  );
};

const customExVAT = (rowData) => {
  return (
    <Input
      id={rowData.sku}
      variant="outlined"
      value={rowData.exVat || ''}
      endAdornment={<InputAdornment position="end">Baht</InputAdornment>}
      aria-describedby="outlined-weight-helper-text"
      size="small"
      type="number"
      disabled
    />
  );
};

const customTaxCode = (rowData, onTaxCodeChange, taxCode) => {
  const fields = [
    {
      id: rowData.sku,
      label: '',
      fieldName: 'taxCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      value: rowData.taxCode || valueTaxCodes.O7,
      data: taxCode || [],
      hidden: +rowData.level !== 1,
    },
  ];

  return (
    <Fields
      conditionalArray={fields}
      onChange={(e) => onTaxCodeChange(rowData, e)}
    />
  );
};
const priceDetailColumns = [
  {
    title: 'Branch BOM Code/ Items Code',
    field: 'bomBranchCode',
    width: 'calc(15%)',
    render: (rowData) => rowData.subCode || rowData.itemCode || rowData.bomBranchCode || rowData.sku,
  },
  {
    title: 'Branch BOM Name/ Item Desc Name',
    field: 'bomBranchName',
    width: 'calc(15%)',
    render: (rowData) => rowData.subName ||
      rowData.itemName || rowData.bomBranchName || rowData.bomGroupName,
  },
  {
    title: 'Level',
    field: 'level',
    width: 'calc(5%)',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    }
  },
  {
    title: 'Indicator',
    field: 'indicatorName',
    width: 'calc(5%)',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    }
  },
  {
    title: 'Price',
    field: 'price',
    width: 'calc(15%)',
    render: (rowData) => rowData.price ? (`${rowData.price} Baht`) : '',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    }
  },
  {
    title: 'Tax Code',
    field: 'taxCode',
    width: 'calc(15%)',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    }
  },
  {
    title: 'EX VAT',
    field: 'exVat',
    width: 'calc(15%)',
    render: (rowData) =>  rowData.taxCode === BranchBOMPrice.taxCodes.OX || !rowData.exVat || +rowData.exVat === 0 ? '' : (`${rowData.exVat} Baht`),
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    }
  },
];

const priceEditColumns = (onPriceChange, onTaxCodeChange, taxCode) => [
  {
    title: 'Branch BOM Code/ Items Code',
    field: 'bomBranchCode',
    width: 'calc(15%)',
    render: (rowData) => rowData.subCode || rowData.itemCode || rowData.bomBranchCode || rowData.sku,
  },
  {
    title: 'Branch BOM Name/ Item Desc Name',
    field: 'bomBranchName',
    width: 'calc(15%)',
    render: (rowData) => rowData.subName ||
      rowData.itemName || rowData.bomBranchName || rowData.bomGroupName,

  },
  {
    title: 'Level',
    field: 'level',
    width: 'calc(5%)',
  },
  {
    title: 'Indicator',
    field: 'indicatorName',
    width: 'calc(5%)',
  },
  {
    title: 'Price',
    field: 'price',
    width: 'calc(15%)',
    headerStyle: {textAlign: 'center'},
    render: (rowData) => customPriceField(rowData, onPriceChange),
  },
  {
    title: 'Tax Code',
    field: 'taxCode',
    width: 'calc(15%)',
    render: (rowData) => customTaxCode(rowData, onTaxCodeChange, taxCode),
  },
  {
    title: 'EX VAT',
    field: 'exVat',
    width: 'calc(15%)',
    render: (rowData) => customExVAT(rowData),
  },
];

const valueTaxCodes = {
  O7: 'O7',
  OX: 'OX',
};

const priceEditOptions = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

export { priceEditColumns, priceEditOptions, valueTaxCodes, priceDetailColumns };
