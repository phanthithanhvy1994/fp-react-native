import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import {
  FieldConstant,
  StockCount,
  dateFormat
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import Fields from '../../../shared/fields/fields.component';
import { statusAllowEditStockCount, statusAllowCloseStockCount } from '../list/stock-count-list.config';
import { getFinalBaseUnitValue } from '../../../material/material.common';
import { formatDateString } from '../../../../util/date-util';


// Fields in detail form
const getFields = (detailData, onBranchChange, onStockCountTypeChange, isEditPage = false) => [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onBranchChange,
    required: true,
    data: [],
    disabled: !!isEditPage
  },
  {
    label: 'Stock Count Type',
    id: 'stockCountTypeValue',
    fieldName: 'stockCountTypeValue',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onStockCountTypeChange,
    required: true,
    data: [],
    disabled: !!isEditPage
  },
  {
    label: 'Note',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    maxLength: 256,
  },
  {
    label: 'POS Consumption Date',
    fieldName: 'posConsumptionDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    disabled: true,
    value:
      (!isEditPage && formatDateString(new Date(), dateFormat.yyyymmdd)) ||
      (formatDateString(detailData.consumptionDate, dateFormat.yyyymmdd, true)) ||
      '',
  },
];

const validation = [
  {
    name: 'branchCode',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'stockCountTypeValue',
    rule: {
      required: `Stock Count Type ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Columns in detail grid
const noField = {
  title: 'No.',
  field: 'no',
  editable: 'never',
};
const consumptionQtyField = {
  title: 'Consumption Qty.',
  field: 'consumptionQuantity',
  editable: 'never',
  render: function customRender(rowData) {
    return <>
      {rowData.consumptionQuantity || ''}
      <p>{(rowData.consumptionQuantity && rowData.baseUnit) || ''}</p>
    </>;
  }
};
const yieldLossField = {
  title: 'Yield/Loss',
  field: 'yieldLoss',
  editable: 'never',
};
const reasonField = (onFieldChange, configItemDataOnGrid, isDetailsPage) => ({
  title: 'Reason',
  field: 'reason',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'reason',
        id: `reason${rowData.id}`,
        fieldType: FieldConstant.type.SELECT,
        className: FieldConstant.class.SELECT,
        classCustom: 'full-width-column-field',
        value: rowData.reason || '',
        data: configItemDataOnGrid.reason,
      },
    ];
    return isDetailsPage ? (rowData.reasonName) : (<Fields
      conditionalArray={fields}
      onChange={(e) =>
        onFieldChange(
          'reason',
          e.target.value,
          rowData
        )
      }
    />);
  },
  width: 160,
});
const itemField = {
  title: 'Item',
  field: 'item',
  editable: 'never',
  customType: 'imageInfo',
  infoList: [
    { fieldName: 'sku', label: 'Code' },
    { fieldName: 'materialDescription', noLabel: true },
    { fieldName: 'materialTypeName', label: 'Type' },
    { fieldName: 'materialGroupName', label: 'Group' },
  ],
  cellStyle: {
    width: '20%',
  },
};
const orderQuantityField = (detailData, onFieldChange, isDetailsPage, customOnChange) => ({
  title: 'Counted Order Qty.',
  field: 'orderQuantity',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'orderQuantity',
        id: `orderQuantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.orderQuantity !== undefined ? rowData.orderQuantity : 0,
        numberDecimalCharacter: 3,
        disabled: !detailData || !detailData.status || detailData.status.toString() !== StockCount.statusValue.counting
      },
    ];
    return (
      <>
        {!isDetailsPage ? (
          <Fields
            conditionalArray={fields}
            onChange={(item, newValue) =>
              onFieldChange('orderQuantity', newValue, rowData, customOnChange)
            }
          />
        ) : (
          fields[0].value
        )}
        <p>{rowData.orderUnit}</p>
      </>
    );
  },
  width: 200,
});
const basedQuantityField = (detailData, onFieldChange, isDetailsPage, customOnChange) => ({
  title: 'Counted Based Qty.',
  field: 'basedQuantity',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'basedQuantity',
        id: `basedQuantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.basedQuantity !== undefined ? rowData.basedQuantity : 0,
        numberDecimalCharacter: 3,
        disabled: !detailData || !detailData.status || detailData.status.toString() !== StockCount.statusValue.counting
      },
    ];
    return (
      <>
        {!isDetailsPage ? (
          <Fields
            conditionalArray={fields}
            onChange={(item, newValue) =>
              onFieldChange('basedQuantity', newValue, rowData, customOnChange)
            }
            
          />
        ) : (
          fields[0].value
        )}
        <p>{rowData.baseUnit}</p>
      </>
    );
  },
  width: 200,
});
const totalCountedField = {
  title: 'Total Counted',
  field: 'totalCounted',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {getTotalCounted(rowData) || ''}
      <p>{(getTotalCounted(rowData) && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const stockOnHandField = {
  title: 'Stock On Hand',
  field: 'stockOnHandQuantity',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {rowData.stockOnHandQuantity || ''}
      <p>{(rowData.stockOnHandQuantity && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const gapField = (detailData) => ({
  title: 'Gap',
  field: 'gap',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {getGap(rowData) || ''}
      <p style={{height: 15}}></p>
    </>);
  }
});
const noteField = (onFieldChange, isDetailsPage) => ({
  title: 'Note',
  field: 'note',
  editable: 'never',
  render: function customRender(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'description',
        id: `note${rowData.id}`,
        fieldType: FieldConstant.type.TEXT_AREA,
        className: FieldConstant.class.TEXT_AREA,
        noPlaceHolder: true,
        classCustom: 'full-width-column-field custom-height-column-field',
        value: rowData.description || '',
        rowsMin: 3,
        maxLength: 50
      },
    ];
    return (!isDetailsPage && (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(StockCount.description, e.target.value, rowData)
        }
      />
    )) || rowData.description;
  },
  width: 250
});
const columnsDetail = (detailData, customOnChange) => (
  onFieldChange,
  configItemDataOnGrid,
  isDetailsPage
) => [
  noField,
  itemField,
  consumptionQtyField,
  orderQuantityField(detailData, onFieldChange, isDetailsPage, customOnChange),
  basedQuantityField(detailData, onFieldChange, isDetailsPage, customOnChange),
  totalCountedField,
  stockOnHandField,
  gapField(detailData),
  yieldLossField,
  reasonField(onFieldChange, configItemDataOnGrid, isDetailsPage),
  noteField(onFieldChange, isDetailsPage),
];

const options = {
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

// For detail page
const bottomGridButtonsArray = (detailData, exportData) => {
  const detailStatus =
    detailData && detailData.status && detailData.status.toString();

  return [
    {
      title: 'Cancel',
      handleFor: 'cancel',
      className: 'btnNeutral',
      hidden: detailStatus !== StockCount.statusValue.approved,
    },
    {
      title: 'Reject',
      handleFor: 'reject',
      className: 'btnDanger',
      hidden: !detailData || detailStatus !== StockCount.statusValue.waitingForApproval,
    },
    {
      title: 'Approve',
      handleFor: 'approve',
      className: 'btnPrimary',
      hidden: !detailData || (detailStatus !== StockCount.statusValue.waitingForApproval
        && detailStatus !== StockCount.statusValue.failed),
    },
    {
      title: 'Close Document',
      handleFor: 'close',
      className: 'btnNeutral',
      hidden: !detailData || statusAllowCloseStockCount.indexOf(detailStatus) === -1
    },
    {
      title: 'Edit',
      handleFor: 'edit',
      className: 'btnSecondary',
      hidden: !detailData || statusAllowEditStockCount.indexOf(detailStatus) === -1,
    },
    {
      title: 'Print',
      handleFor: 'print',
      className: 'btnSecondary',
      hidden: detailStatus !== StockCount.statusValue.approved,
    },
    {
      title: 'Export',
      handleFor: 'export',
      useExportCmp: true,
      className: 'btnSecondary',
      classCustom: 'export-detail-btn',
      hidden: detailStatus !== StockCount.statusValue.approved,
      typeExport: true,
      exportData: exportData,
      isAOA: true,
      fileName: 'Stock Count'
    },
  ];
};

const fieldsLabelArray = detailData => [
  {
    label: 'Branch',
    fieldName: 'branchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.branchName) || '',
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.statusName) || '',
  },
  {
    label: 'Stock Count Type',
    fieldName: 'stockCountTypeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.stockCountTypeName) || '',
  },
  {
    label: 'Cancel Reason',
    fieldName: 'cancelReason',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.cancelReason) || '',
  },
  {
    label: 'Approved By',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.approvedBy) || '',
  },
  {
    label: 'Material Document',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.materialDocument) || '',
  },
  {
    label: 'Note',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.description) || '',
  },
  {
    label: 'POS Consumption Date',
    fieldName: 'posConsumptionDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && formatDateString(detailData.consumptionDate, dateFormat.mainDate, true)) || '',
  },
];

const exportConfigs = {
  fileName: 'Stock Count',
  headers: [
    'Material Code',
    'Material Description',
    'Counted Order Quantity',
    'Counted Based Quantity'
  ],
  unusedFields: []
};

const importHeaders = [
  'Material Code',
  'Material Description',
  'Counted Order Quantity',
  'Counted Based Quantity',
];

const customToolbarContent = (detailData, isDetailsPage, listCounting, startStockCountHandler, filterExportData, onClickImportData, handleImportData, importRef) => {
  const isCounting = detailData &&
    (detailData.status && detailData.status.toString()) === StockCount.statusValue.counting;
  return [{
    type: 'load-item',
    title: 'Load Stock',
    icon: <RefreshIcon />,
    disabled: !detailData || !detailData.branchCode || !detailData.stockCountTypeValue || isCounting,
    hidden: isDetailsPage
  }, {
    type: 'other',
    title: 'Start Stock Count',
    icon: <RefreshIcon />,
    disabled: !listCounting || listCounting.length === 0 || isCounting,
    handler: startStockCountHandler,
    hidden: isDetailsPage
  }, {
    type: 'export',
    filterExportData: filterExportData,
    typeExport: true,
    exportConfigs: exportConfigs,
    disabled: !isCounting,
    hidden: isDetailsPage,
  }, {
    type: 'import',
    title: 'Import',
    importHeaders: importHeaders,
    handleImportData: handleImportData,
    importRef: importRef,
    onClickImportData: onClickImportData,
    disabled: !isCounting,
    icon: <SaveAltIcon />,
    hidden: isDetailsPage,
    msgNotValidFile: 'The import file is not valid!'
  }];
};

const informationConvert = [
  { label: 'Code', value: 'sku' },
  { label: 'Material Description', value: 'materialDescription' },
  { label: 'Type', value: 'materialType' },
  { label: 'Group', value: 'materialGroup' },
];

const getTotalCounted = (rowData) => {
  const numberBaseQtyOfOrderUnit = getFinalBaseUnitValue(rowData, 'orderQuantity');
  const totalCounted = +numberBaseQtyOfOrderUnit + +(rowData.basedQuantity || 0);

  return totalCounted;
};

const getGap = (rowData) => {
  const totalCounted = getTotalCounted(rowData);
  return totalCounted - +(rowData.stockOnHandQuantity || 0);
};

const comparedInfoDiv = (detailData, getNumOfDifferentQuantity) => {
  const numOfDiff = getNumOfDifferentQuantity(detailData);
  const numSame = detailData && detailData.stockCountDetailVOs && (detailData.stockCountDetailVOs.length - numOfDiff);
  const isDraft = (detailData && detailData.status && detailData.status.toString()) === StockCount.statusValue.draft;
  return {
    title: 'Compare the imported data with stock on hand',
    data: [{
      label: 'The counted quantity and system quantity are different',
      fieldName: 'numberOfDifferentQuantity',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (!isDraft && numOfDiff) || '',
    }, {
      label: 'The counted quantity is equal to the system quantity',
      fieldName: 'numberOfSameQuantity',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (!isDraft && numSame) || '',
    }]
  };
};

export {
  getFields,
  validation,
  options,
  columnsDetail,
  bottomGridButtonsArray,
  fieldsLabelArray,
  customToolbarContent,
  informationConvert,
  comparedInfoDiv,
  getTotalCounted,
  getGap
};
