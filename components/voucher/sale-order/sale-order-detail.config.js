import React from 'react';
import {ReactComponent as ScanQR} from '../../../assets/scanQR.svg';
import { FieldConstant, Voucher } from '../../../constants/constants';

// Common option for detail information grid.
const options = {
  // Disable search feature.
  search: false,
  // Disable paging feature.
  paging: false,
  // Disable sorting feature of table.
  sorting: false,
  // Hidden title of table.
  showTitle: false,
  // Position of Action is on the right.
  actionsColumnIndex: -1,
};

// For general information page.
const fieldsLabelArraySaleOrder = (detailData) => [
  {
    label: 'Sold To',
    id: 'soldTo',
    fieldName: 'soldTo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: `${detailData?.soldTo} - ${detailData?.soldToName}`,
  },
  {
    label: 'Ship To',
    id: 'shipTo',
    fieldName: 'shipTo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: `${detailData?.shipTo} - ${detailData?.shipToName}`,
  },
  {
    label: 'Customer PO No.',
    id: 'customerPONo',
    fieldName: 'customerPONo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: detailData?.customerCode,
  },
];

// For detail information page.
const columnsDetail = () => [
  {
    title: 'No.',
    field: 'no',
    editable: 'never',
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px',
      width: '3%',
    }
  },
  {
    title: 'Type',
    field: 'typeName',
    editable: 'never',
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px',
      width: '13%'
    },
    render: rowData => {
      return rowData.typeName?.toUpperCase();
    },
  },
  {
    title: 'Material No.',
    field: 'sku',
    editable: 'never',
    headerStyle: {
      textAlign: 'left',
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px',
      width: '12%',
    }
  },
  {
    title: 'Voucher Mat Desc',
    field: 'description',
    editable: 'never',
    headerStyle: {
      textAlign: 'left',
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px',
      width: '35%'
    },
    render: function customRender(rowData) {
      return <span className={rowData.isTotalSummarize ? 'total-summarize-label' : ''}>{rowData.description}</span>;
    }
  },
  {
    title: 'Order Quantity',
    field: 'quantity',
    editable: 'never',
    align: 'left',
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px',
    }
  },
  {
    title: 'Scanned Quantity',
    //TODO: Update new quantity for scanner
    field: 'scannedQuantity',
    editable: 'never',
    headerStyle: {
      textAlign: 'right',
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px'
    }
  },
];

// Icons action of detail information grid.
const icons = {
  scanVoucher: 
    <span className="MuiButton-root" type="button">
      {Voucher.scanLabel} <ScanQR/>
    </span>,
  createVoucher: 
    <span className="MuiButton-root" type="button">
      {Voucher.createLabel}
    </span>,
};

// Config for action of detail information grid.
const actions = (
  goToCreateVoucherPage,
  goToScanVoucherPage,
  handleHiddenActionButton
) => [
  (data) => ({
    icon: () => icons.createVoucher,
    tooltip: 'Create Voucher',
    onClick: (event, rowData) => {
      goToCreateVoucherPage(rowData);
    },
    hidden: handleHiddenActionButton(data, true) || data.isHideAllActions,
  }),
  (data) => ({
    icon: () => icons.scanVoucher,
    tooltip: 'Scan',
    onClick: (event, rowData) => {
      goToScanVoucherPage(rowData);
    },
    hidden: handleHiddenActionButton(data, false) || data.isHideAllActions,
  }),
];

// Config for summarize total area.
const totalSummarizeInGrid = [
  { fieldName: 'description', isOnlyShowLabelTotal: true, label: 'Total' },
  { fieldName: 'quantity', label: 'Total Order Quantity' },
  // TODO: Update new quantity of Scanner
  { fieldName: 'scannedQuantity', label: 'Total Scanned Quantity' }
];

export {
  options,
  actions,
  fieldsLabelArraySaleOrder,
  columnsDetail,
  totalSummarizeInGrid,
};
