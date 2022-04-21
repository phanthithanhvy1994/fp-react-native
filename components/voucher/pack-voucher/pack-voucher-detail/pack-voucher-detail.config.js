import {FieldConstant, PackVoucherConstant} from '../../../../constants/constants';
import {formatDateString} from '../../../../util/date-util';

// Common option for detail information grid.
const options = {
  // Disable search feature.
  search: false,
  // Hidden title of table.
  showTitle: false,
  // Hidden paging default
  paging: false,
};

// Config for General information
const fieldsLabelArray = (data) => [
  {
    label: 'Value Pack No',
    id: 'packNumber',
    fieldName: 'packNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.packNumber) || '',
  },
  {
    label: 'Value Pack Name',
    id: 'packName',
    fieldName: 'packName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.packName) || '',
  },
  {
    label: 'Note',
    id: 'note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.note) || '',
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'Total Value',
    id: 'totalValue',
    fieldName: 'totalValue',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && `${data.totalValue} Baht`) || '',
  }
];

// Config columns details
const columnsDetail = () => [
  {
    title: 'Serial No.',
    field: 'serialNo',
    editable: 'never',
    width: 220,
    headerStyle: {
      textAlign: 'left'
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Voucher Value',
    field: 'voucherValue',
    editable: 'never',
    width: 230,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px'
    },
    render: rowData => {
      return `${rowData['voucherValue']} Baht`;
    }
  }, {
    title: 'Status',
    field: 'status',
    editable: 'never',
    width: 200,
    headerStyle: {
      textAlign: 'left'
    },
    render: (row) => {
      return (row.status === 1) ? PackVoucherConstant.status.new : PackVoucherConstant.status.assigned;
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Valid From',
    field: 'validFrom',
    editable: 'never',
    width: 200,
    headerStyle: {
      textAlign: 'left'
    },
    render: (rowData) => {
      return (rowData.validFrom
        && formatDateString(rowData.validFrom, PackVoucherConstant.formatDate, true)
      ) || '';
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }, {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
    width: 200,
    headerStyle: {
      textAlign: 'left'
    },
    render: (rowData) => {
      return (rowData.validTo
        && formatDateString(rowData.validTo, PackVoucherConstant.formatDate, true)
      ) || '';
    },
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  }
];

export {
  options,
  fieldsLabelArray,
  columnsDetail
};
  