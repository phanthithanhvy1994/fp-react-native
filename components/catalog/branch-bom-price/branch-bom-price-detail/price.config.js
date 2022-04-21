import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '../../../shared/buttons/button.component';
import { calculateExVat } from '../branch-bom-price.util';
import {BranchBOMPrice} from '../../../../constants/constants';

const renderActionView = (rowData, handleView) => {
  return (
    <Button 
      icon = {<VisibilityIcon />}
      handleClick = {() => handleView(rowData)}
      classCustom = 'view-btn'
    />
  );
};

const priceColumns = (handleView) => [
  {
    title: 'No.',
    field: 'lineNumber',
    render: (rowData) => rowData.lineNumber,
    defaultSort: 'asc',
    width: 'calc(4%)',
  },
  {
    title: 'Action',
    field: 'action',
    render: (rowData) => renderActionView(rowData, handleView),
    width: 'calc(10%)',
  },
  {
    title: 'Branch BOM Code',
    field: 'itemCode',
  },
  {
    title: 'Branch BOM Name',
    field: 'itemName',
  },
  {
    title: 'Level',
    field: 'level',
  },
  { title: 'Price', field: 'price' },
  { title: 'Tax Code', field: 'taxCode' },
  {
    title: 'EX VAT',
    field: 'exVat',
    render: (rowData) => rowData.taxCode === BranchBOMPrice.taxCodes.O7 ? calculateExVat(rowData.price) : '',
  },
  {
    title: 'Category Name',
    field: 'categoryName',
  },
  { title: 'Note', field: 'description' },
];

const priceOptions = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

export { priceColumns, priceOptions };
