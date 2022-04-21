import { formatDateString } from '../../../../util/date-util';
import {
  FieldConstant,
  dateFormat,
  GoodsIssuesConstant
} from '../../../../constants//constants';

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
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchName) || '',
  },
  {
    label: 'Department',
    id: 'departmentCode',
    fieldName: 'departmentCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.departmentName) || '',
  },
  {
    label: 'Goods Issues No.',
    id: 'goodsIssuesNumber',
    fieldName: 'goodsIssuesNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.goodsIssuesNumber) || '',
  },
  {
    label: 'Type',
    id: 'typeName',
    fieldName: 'typeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.typeName) || '',
  },
  {
    label: 'Created Date',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (data &&
        formatDateString(
          data.createdDate,
          dateFormat.yyyymmddHHmmss,
          true
        )) ||
      '',
  },
  {
    label: 'Submitted Date',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (data &&
        formatDateString(
          data.submittedDate,
          dateFormat.yyyymmddHHmmss,
          true
        )) ||
      '',
  },
  {
    label: 'Material Document',
    id: 'materialDocument',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.materialDocument) || '',
  },
  {
    label: 'Status',
    id: 'statusName',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'Header Note',
    id: 'headerNote',
    fieldName: 'headerNote',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.headerNote) || '',
  },  
];

// Config columns details
const columnsDetail = () => [
  {
    title: 'No.',
    field: 'lineNumber',
    editable: 'never',
    width: 16,
  },
  {
    title: 'Item',
    field: 'item',
    editable: 'never',
    width: 220,
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'sku', label: 'Code' },
      { fieldName: 'description', noLabel: true },
      {
        noLabel: true,
        fieldName: 'baseUnitInfo',
        customDisplay: (data) => {
          return (
            (data.denominator &&
              data.orderUnit &&
              `${data.denominator} ${data.orderUnit} = ${data.numerator} ${data.baseUnit}`) ||
            ''
          );
        },
      },
    ],
    cellStyle: {
      width: 318,
      fontSize: '12px'
    },
  },
  {
    title: 'Issue Order Qty.',
    field: 'orderQuantity',
    editable: 'never',
    width: 127,
    render: (rowData) => `${rowData?.orderQuantity || 0} ${rowData.orderUnit}`,
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'      
    },
  },

  {
    title: 'Issue Base Qty.',
    field: 'baseQuantity',
    editable: 'never',
    width: 136,
    render: (rowData) => `${rowData.baseQuantity} ${rowData.baseUnit}`,
    cellStyle: {
      textAlign: 'center', 
      fontSize: '12px'     
    },
  },

  {
    title: 'Total Order Qty.',
    field: 'totalQuantity',
    editable: 'never',
    width: 117,
    render: (rowData) => `${rowData.totalQuantity} ${rowData.baseUnit}`,
    // headerStyle: {
    //   textAlign: 'right'
    // },
    
    cellStyle: {
      textAlign: 'center',   
      fontSize: '12px'  
    }
  },
  {
    title: 'Reason',
    field: 'reasonName',
    editable: 'never',
    width: 159,
    // headerStyle: {
    //   textAlign: 'left'
    // },
    
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'
    }
  },
  {
    title: 'Internal Order',
    field: 'internalOrder',
    editable: 'never',
    width: 111,
    // headerStyle: {
    //   textAlign: 'left'
    // },    
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'
    }
  },  
  {
    title: 'Cost Order',
    field: 'costCenter',
    editable: 'never',
    width: 111,
    // headerStyle: {
    //   textAlign: 'left'
    // },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'
    }
  },    
  {
    title: 'Note',
    field: 'note',
    editable: 'never',
    width: 189,
    // headerStyle: {
    //   textAlign: 'left'
    // },    
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'
    }
  },    
];

// For detail page
const bottomGridButtonsArray = (status) => {
  const buttonStatus =  status && status.toString();
  return [
    {
      title: 'Edit',
      handleFor: 'edit',
      className: 'btnSecondary',
      handleClick: null,
      // status: Draft, Rejected
      hidden: +buttonStatus !== +GoodsIssuesConstant.statusValue.draft &&
              +buttonStatus !== +GoodsIssuesConstant.statusValue.failed,       
    },
    {
      title: 'Close Document',
      handleFor: 'close',
      className: 'btnNeutral',
      handleClick: null,
      // status: 1.draft 2.submitted 3.inProcess 4.closed  5.failed   
      hidden: +buttonStatus !== +GoodsIssuesConstant.statusValue.draft &&
              +buttonStatus !== +GoodsIssuesConstant.statusValue.failed,        
    },
  ];
};

export {
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray
};
