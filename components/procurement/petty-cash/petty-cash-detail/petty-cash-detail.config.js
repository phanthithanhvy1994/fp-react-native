import { FieldConstant } from '../../../../constants/constants';

const headerFields = (data) => [
  {
    label: 'Branch',
    id: 'branchCodeName',
    fieldName: 'branchCodeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchCodeName) || '',
  },
  {
    label: 'PO Petty Cash (SAP)',
    id: 'poNumber',
    fieldName: 'poNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.poNumber) || '',
  },
  {
    label: 'Type',
    id: 'typePettyCash',
    fieldName: 'typePettyCash',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.typePettyCash) || '',
  },
  {
    label: 'Invoice No.',
    id: 'invoiceNo',
    fieldName: 'invoiceNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.invoiceNo) || '',
  },
  {
    label: 'Vender\'s Name',
    id: 'venderName',
    fieldName: 'venderName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.venderName) || '',
  },
  {
    label: 'Invoice Date',
    id: 'invoiceDate',
    fieldName: 'invoiceDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.invoiceDate) || '',
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.status) || '',
  },
  {
    label: 'Note',
    id: 'note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.note) || '',
  },

  {
    label: 'Attached Images',
    id: 'attachedImages',
    fieldName: 'attachedImages',
    fieldType: FieldConstant.type.UPLOAD_FILE,
    config: { maxValue: 2, disableUpload: true, imgArr: [] },
    value: [],
  },
  {
    label: 'Reject Reason',
    id: 'rejectReason',
    fieldName: 'rejectReason',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.rejectReason) || '',
  },
];

const columnsDetail = [
  {
    title: 'No.',
    field: 'no',
    width: 50,
  },
  {
    title: 'Item',
    field: 'item',
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'materialCode', label: 'Code' },
      { fieldName: 'materialDescription', noLabel: true },
    ],
    cellStyle: {
      width: '29%',
    },
  },
  {
    title: 'Quantity',
    field: 'pettyCashQty',
    width: 130,
  },
  {
    title: 'Amouunt',
    field: 'amount',
    width: 130,
  },
  {
    title: 'VAT',
    field: 'deliveredDate',
    width: 130,
  },
  {
    title: 'Remark',
    field: 'remark',
  },
  {
    title: 'Delivery Date',
    field: 'deliveryDate',
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const bottomGridButtonsArray = (handleCustomSubmit,status) => {
  return [
    {
      title: 'Submit',
      handleFor: 'submit',
      className: 'btnSecondary',
      customHandleClick: true,
      handleClick: ()=> handleCustomSubmit(),
      hidden: false,    
    },
    {
      title: 'Close',
      handleFor: 'close',
      className: 'btnNeutral',
      handleClick: null,  
      hidden: false, 
    },
    {
      title: 'Reject',
      handleFor: 'reject',
      className: 'btnDanger',
      handleClick: null,
      hidden: false, 
    },
    {
      title: 'Approve',
      handleFor: 'approve',
      className: 'btnPrimary',
      handleClick: null,
      hidden: false, 
    },
  ];
};

const totalSummarizeInGrid = [
  {
    label: 'Total',
    fieldName: 'amount',
  },
];
  
export { columnsDetail, options, headerFields, bottomGridButtonsArray, totalSummarizeInGrid };