import React from 'react';

const renderBaseUnit = (rowData) => <span>{rowData.uom}</span>;

const columns = [
  {
    title: 'Item',
    field: 'item',
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'sku', label: 'Code' },
      { fieldName: 'description', noLabel: true },
      { fieldName: 'baseUom', label: 'Product Unit' },
      { fieldName: 'materialTypeName', label: 'Type' },
      { fieldName: 'materialGroupName', label: 'Group' },
    ],
    cellStyle: {
      width: '25%',
      textAlign: 'left',
    },
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Stock On Hand',
    field: 'stockOnHand',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Outgoing Stock',
    field: 'outGoingStock',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
    render: function customRender(rowData) {
      const outgoingQuantity = rowData.outGoingStock
        ? `-${rowData.outGoingStock}`
        : '';
      return <>{outgoingQuantity || ''}</>;
    },
  },
  {
    title: 'Incoming Stock',
    field: 'inComingStock',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Base Unit',
    field: 'baseUnit',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
    render: (rowData) => renderBaseUnit(rowData),
  },
  {
    title: 'Min Stock Level',
    field: 'minStockLevel',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Max Stock Level',
    field: 'minStockLevel',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Average Used',
    field: 'averageUsed',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Branch',
    field: 'branchName',
    width: 150,
    headerStyle: {
      textAlign: 'center',
    },
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

export { columns, options };
