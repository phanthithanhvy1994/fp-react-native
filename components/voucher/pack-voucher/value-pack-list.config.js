import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Delete from '@material-ui/icons/Delete';
import { ReactComponent as ScanQR } from '../../../assets/scanQR.svg';
import {FieldConstant, PackVoucherConstant} from '../../../constants/constants';

const options = {
  search: false,
  toolbar: false,
  paging: false,
  exportButton: false,
  sorting: false,
  showTitle: false,
  selection: true
};

// Config for search form
const fields = [
  {
    label: 'Value Pack No.',
    id: 'packNumber',
    fieldName: 'packNumber',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    data: [],
  },
  {
    label: 'Value Pack Name',
    id: 'packName',
    fieldName: 'packName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    data: [],
  },
  {
    label: 'Status',
    id: 'statusName',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: [],
  },
];

// Config for table grid detail
const columnsDetail = [
  {
    title: 'Value Pack No',
    field: 'packNumber',
    editable: 'never',
    width: 160,
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Value Pack Name',
    field: 'packName',
    editable: 'never',
    width: 160,
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Total Value',
    field: 'totalValue',
    editable: 'never',
    width: 175,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px'
    },
    render: rowData => {
      return `${rowData['totalValue']} Baht`;
    }
  }, {
    title: 'Status',
    field: 'statusName',
    editable: 'never',
    width: 150,
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Note',
    field: 'note',
    editable: 'never',
    width: 230,
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }
];

const icons = {
  view: <VisibilityIcon />,
  delete: <Delete />,
  allocation: <ScanQR />,
};

// Config for actions on table grid
const actions = (
  goToDetailPage,
  confirmDeleteItem,
  goToValuePackAllocation
) => [
  {
    tooltip: 'View',
    icon: () => icons.view,
    onClick: (e, rowData) => {
      goToDetailPage(rowData);
    },
    position: 'row'
  }, {
    tooltip: 'Delete',
    icon: () => icons.delete,
    onClick: (e, rowData) => {
      confirmDeleteItem(rowData);
    },
    position: 'row'
  }, {
    tooltip: 'Allocation',
    icon: () => icons.allocation,
    onClick: (e, rowData) => {
      goToValuePackAllocation(rowData);
    },
    position: 'row',
    disabledFunc: (row) => {
      return row.statusName === PackVoucherConstant.status.assigned;
    },
  },
];

// Header column in excel export file
const importHeaders = [
  'Value Pack No',
  'Value Pack Name',
  'Total Value (Baht)',
  'Status',
  'Note',
];

// Config export file
const exportConfigs = {
  fileName: 'Pack_Value_List_Items',
  headers: importHeaders,
  unusedFields: ['Description'],
};

export {
  fields,
  columnsDetail,
  actions,
  options,
  exportConfigs
};