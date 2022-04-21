import React from 'react';
import { FieldConstant } from '../../../../constants/constants';
import {
  importHeaders,
} from '../branch-bom-price-edit/branch-bom-price-edit.config';
import { exportConfigs } from '../branch-bom-price-edit/price.config';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddIcon from '@material-ui/icons/Add';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

export const informationConvert = [
  { label: 'bomBranchCode' },
  { label: 'bomBranchName' },
];

export const branchBOMSearchFields = [
  {
    label: 'Branch BOM',
    id: 'bomBranch',
    fieldName: 'bomBranch',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Category',
    id: 'categoryCode',
    fieldName: 'categoryCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    fieldType: FieldConstant.type.NONE
  }
];

export const customToolbarContent = (handleImportData, importRef, onClickImportData, filterExportData) => [{
  type: 'import',
  title: 'Import',
  importHeaders: importHeaders,
  handleImportData: handleImportData,
  importRef: importRef,
  onClickImportData: onClickImportData,
  icon: <SaveAltIcon />
}, {
  type: 'export',
  filterExportData: filterExportData,
  typeExport: true,
  exportConfigs: exportConfigs
}, {
  type: 'remove-item',
  title: 'Remove Item',
  icon: <RemoveCircleOutlineIcon />
}, {
  type: 'add-item',
  title: 'Add Item',
  icon: <AddIcon />
}];
