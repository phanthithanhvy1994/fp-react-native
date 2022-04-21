export const dateFormat = {
  mmddyyyy: 'MM/DD/yyyy',
  yyyymmdd: 'YYYY-MM-DD',
  ddmmyyyy: 'DD-MM-YYYY',
  yyyymmddHHmmss: 'YYYY-MM-DD HH:mm:ss',
  yyyymmddStartDay: 'YYYY-MM-DD 00:00:00',
  yyyymmddEndDay: 'YYYY-MM-DD 23:59:59',
  // format datetime from server for datetime data
  savingDateTime: 'YYYYMMDDHHmmss',
  savingDate: 'YYYYMMDD',
  savingDateTimeStartDate: 'YYYYMMDD000000',
  savingDateTimeEndDate: 'YYYYMMDD235959',
  searchingDateTime: 'YYYYMMDD000000',
  mainDate: 'DD.MM.YYYY',
  mainDateTime: 'DD.MM.YYYY HH:mm:ss',
  serverFormatRegex: /^[0-9]{14}$/g,
  dateTime: 'dddd, MMMM D, YYYY h:mm A',
  time: 'HH:mm:ss',
  exportDate: 'YYYYMMDD_HHmmss',
};

export const userBranchInfo = {
  defaultBranch: 'B001',
};

// Constant of dialog component
export const dialogConstant = {
  type: {
    ERROR: 'error',
    WARNING: 'warning',
    CONFIRM: 'confirm',
    INFO: 'info',
  },
  button: {
    FUNCTION: 'function',
    NONE_FUNCTION: 'none_function',
  },
};

export const EnumDate = {
  Sun: '1',
  Mon: '2',
  Tue: '3',
  Wed: '4',
  Thu: '5',
  Fri: '6',
  Sat: '7',
};

// Constant of button className css
export const ButtonConstant = {
  type: {
    PRIMARY: 'btnPrimary',
    WARNING: 'btnWarning',
    DANGER: 'btnDanger',
    SUCCESS: 'btnSuccess',
    SECONDARY: 'btnSecondary',
    NEUTRAL: 'btnNeutral',
  },
  width: {
    FULL_WIDTH: 'btnFullWidth',
  },
};

// Constant of field
export const FieldConstant = {
  type: {
    TEXT: 'text',
    TEXT_ONLY: 'text_only',
    NUMBER: 'number',
    PICKER: 'picker',
    SELECT: 'select',
    MULTI_SELECT: 'multiSelect',
    RANGE_INPUT: 'range_input',
    QUANTITY: 'qty_fields',
    CHECKBOX: 'checkbox',
    UPLOAD_FILE: 'upload_file',
    TEXT_AREA: 'text_area',
    NONE: 'none',
    RADIO: 'radio',
    NUMBER_DECIMAL: 'number_decimal',
  },
  class: {
    TEXT: 'fldText',
    PICKER: 'fldPicker',
    SELECT: 'fldSelect',
    RANGE_INPUT: 'fldRangeInput',
    CHECKBOX: 'checkbox',
    DOUBLE_TEXT: 'doubleTextWidth',
    RADIO: 'radio',
    TEXT_AREA: 'text_area',
  },
  define: {
    ZERO: 0,
  },
  operator: {
    // Search number VO
    number: {
      EQ: {
        display: '=',
        value: 'eq',
      },
      LT: {
        display: '<',
        value: 'lt',
      },
      GT: {
        display: '>',
        value: 'gt',
      },
    },
    // Search text VO
    text: {
      EQ: {
        display: '=',
        value: 'eq',
      },
      LIKE: {
        display: 'like',
        value: 'like',
      },
    },
  },
};

export const StockConstant = {
  paginateParams: {
    COUNT_FLAG: 1,
    DELETE_FLAG: 0,
    CURRENT_PAGE: 1,
    PAGE_SIZE: 25,
  },
  apiParams: {
    SUFIX_INVENTORY: 'SUFIX_INVENTORY',
    MATERIAL_GROUP: 'MATERIAL_GROUP',
  },
  pageTitle: {
    stockList: 'Stock List',
  },
};

export const PaginationConfiguration = {
  itemsPerPage: 25,
  currentPage: 1,
  countFlag: 1,
};

export const CategoryConstant = {
  materialGroup: 'materialGroup',
  materialType: 'materialType',
  materialCode: 'materialCode',
  materialDescription: 'materialDescription',
  pageTitle: {
    materialList: 'Material List',
  },
};

export const OrderConstant = {
  email: 'email',
  note: 'note',
  isEmergency: 'isEmergency',
  branch: 'branch',
  vendor: 'vendor',
  createdBy: 'createdBy',
  orderTypeCodes: 'orderTypeCodes',
  orderType: 'orderType',
  status: 'status',
  poRequestNumber: 'poRequestNumber',
  requestedDate: 'requestedDate',
  deliveryDate: 'deliveryDate',
  open: 'Open',
  inventory: 'inventory',
  type: 'type',
  orderTypeCode: {
    // temporary for testing
    poSTO: 'Z29',
    branchPO: 'Z31',
  },
  materialType: 'materialType',
  materialGroup: 'materialGroup',
  materialCode: 'materialCode',
  sku: 'sku',
  materialDescription: 'materialDescription',
  quantity: 'quantity',
  requestQty: 'requestQty',
  dishQuantity: 'dishQuantity',
  buffet: 'buffet',
  draft: 'Draft',
  rejected: 'Rejected',
  waitingApproval: 'Waiting for Approval',
  inProcess: 'In-process',
  description: 'description',
  orderUnit: 'orderUnit',
  amount: 'amount',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  isFree: 'isFree',
  currency: 'Baht',
  baseUnit: 'baseUnit',
  unconfirmed: 'Unconfirmed',
  label: {
    detailsInformation: 'Details Information',
    branch: 'Branch',
    orderType: 'Order Type',
    createdDate: 'Created Date',
    quantity: 'Quantity',
  },
  searchFieldName: {
    status: 'status',
    branch: 'branchCode',
    vendor: 'vendorCode',
    requestedDate: 'createdDate',
    deliveryDate: 'deliveryDate',
    orderType: 'orderType',
    poRequestNumber: 'poNumber',
    sapResquestNumber: 'sapResquestNumber',
    createdBy: 'createdBy',
    materialDescription: 'description',
  },
  statusValue: {
    draft: '1',
    inProcess: '4',
    waitingApproval: '2',
    closed: '6',
    rejected: '7',
  },
  bomGroupName: 'bomGroupName',
  level: 'level',
  bomBranchName: 'bomBranchName',
  message: {
    warningCode: ['ERR_0232'],
  },
  configDecimal: 2,
};

export const GRConstant = {
  type: 'type',
  branch: 'branch',
  vendor: 'vendor',
  createdBy: 'createdBy',
  status: 'sapExportedStatus',
  searchFieldName: {
    branch: 'branch',
    goodReceiptNo: 'poStoNumber',
    refNo: 'refNumber',
    type: 'goodReceiptType',
    createdBy: 'createdBy',
    submittedDate: 'submittedTime',
    status: 'sapExportedStatus',
    deliveryNote: 'deliveryNote',
    vendor: 'vendor',
    materialDescription: 'materialDescription',
    batchNo: 'batchNo',
    materialDocument: 'materialDocument',
  },
  searchPopup: {
    defaultStatusValue: '3', // status Completed
    defaultStatusDisplay: 'Completed',
    defaultGoodReceiptType: '1', // branch PO
  },
  listType: {
    branchPO: 'BRANCH PO',
    branchDO: 'PO STO',
  },
};

export const ActionType = {
  UPDATE_DETAIL_FIELD_ARRAY: 'UPDATE_DETAIL_FIELD_ARRAY',
  UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY: 'UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY',
  UPDATE_ALL_FIELD_ARRAY: 'UPDATE_ALL_FIELD_ARRAY',
  UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY: 'UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY',
  UPDATE_DETAIL_ADD_ITEMS_FIELD_ARRAY: 'UPDATE_DETAIL_ADD_ITEMS_FIELD_ARRAY',
  UPDATE_DATA_DETAILS_ON_GRID: 'UPDATE_DATA_DETAILS_ON_GRID',
  UPDATE_HISTORY_DATA: 'UPDATE_HISTORY_DATA',
  UPDATE_COLUMNS_DETAIL: 'UPDATE_COLUMNS_DETAIL',
  UPDATE_ADD_ITEMS_SELECTIONS: 'UPDATE_ADD_ITEMS_SELECTIONS',
  UPDATE_OPEN_STATE_SEARCH_POPUP: 'UPDATE_OPEN_STATE_SEARCH_POPUP',
  UPDATE_SELECTED_ROWS: 'UPDATE_SELECTED_ROWS',
  UPDATE_GET_FORM_VALUES_FN: 'UPDATE_GET_FORM_VALUES_FN',
};

export const DetailStateName = {
  dataDetailsOnGrid: 'dataDetailsOnGrid',
  history: 'history',
  columnsDetail: 'columnsDetail',
  addItemsSelections: 'addItemsSelections',
};

export const Action = {
  add: 'Add Items',
  remove: 'Remove',
  load: 'Load Items',
  select: 'Select Items',
  addBranch: 'AddBranchBom',
  addGroup: 'AddGroup',
  addMaterial: 'AddMaterials',
  saveDraft: 'draft',
  save: 'submit',
  ok: 'OK',
  cancel: 'Cancel',
  insert: 'insert',
  update: 'update',
  submit: 'submit',
};

export const ReturnRequestConstant = {
  paginateParams: {
    CURRENT_PAGE: 1,
    COUNT_FLAG: 1,
    DELETE_FLAG: 0,
  },
  branch: 'branch',
  vendor: 'vendor',
  reason: 'reason',
  reasonCode: 'reasonCode',
  createdBy: 'createdBy',
  createdDate: 'createdDate',
  orderType: 'orderType',
  orderTypeCodes: 'orderTypeCodes',
  status: 'status',
  rejected: 'Rejected',
  failed: 'Failed',
  open: 'Open',
  draft: 'Draft',
  sku: 'sku',
  description: 'description',
  productUnit: 'productUnit',
  returnQty: 'returnQty',
  quantity: 'quantity',
  baseUnitQty: 'baseUnitQty',
  returnQtyBu: 'returnQtyBu',
  complaintNo: 'complaintNo',
  batchNo: 'batchNo',
  goodsReceiptNo: 'goodsReceiptNo',
  goodReceiptNo: 'goodReceiptNo',
  creditNote: 'creditNote',
  note: 'note',
  materialType: 'materialType',
  materialGroup: 'materialGroup',
  materialCode: 'materialCode',
  materialDescription: 'materialDescription',
  orderUnit: 'orderUnit',
  attachedImages: 'attachedImages',
  orderTypeCode: {
    // temporary for testing
    returnToVendor: '2',
    returnToFactory: '1',
    returnToFactoryDisplay: 'Return to factory',
    returnToVendorDisplay: 'Return to vendor',
  },
  pageTitle: {
    returnRequestDetails: 'View Return Request Details',
    returnRequestEdit: 'Edit Return Request',
    returnRequestAdd: 'Create Return Request',
  },
  label: {
    detailsInformation: 'Details Information',
    branch: 'Branch',
    orderType: 'Order Type',
    returnTo: 'Return To', // is orderType
    createdDate: 'Created Date',
    goodsReceiptNo: 'Goods Receipt No.',
    creditNote: 'Credit Note',
    note: 'Note',
    reason: 'Reason',
    complaintNo: 'Complaint No',
    batchNo: 'Batch No',
    quantity: 'Quantity',
    returnQty: 'Return Qty',
    taxNo: 'Tax No.',
    country: 'Country',
    postalCode: 'Postal Code',
    city: 'City',
    address1: 'Address 1',
    name1: 'Name 1',
    existedVendorName: 'Existed Vendor Name',
    invoiceDate: 'Invoice Date',
    invoiceNo: 'Invoice No.',
  },
  statusValue: {
    draft: '1',
    waitingApproval: '2',
    approved: '3',
    inProcess: '4',
    rejected: '5',
    closed: '6',
    complete: '7',
    failed: '8',
  },
  statusDisplay: {
    draft: 'Draft',
    rejected: 'Rejected',
  },
  configDecimal: 2,
};

export const ScrapStockConstant = {
  scrap: 'Scrap',
  branch: 'branch',
  branchCode: 'branchCode',
  scrapStockNo: 'scrapStockNo',
  createdBy: 'createdBy',
  createdDate: 'date',
  inventory: 'inventory',
  note: 'note',
  noteDetail: 'noteDetail',
  reason: 'reason',
  quantity: 'quantity',
  status: 'status',
  rejected: 'Rejected',
  draft: 'Draft',
  waitingApproval: 'Waiting for approval',
  sku: 'sku',
  description: 'description',
  productUnit: 'productUnit',
  amount: 'amount',
  materialType: 'materialType',
  materialCode: 'sku',
  materialDescription: 'materialDescription',
  approveBy: 'approveBy',
  baseUom: 'baseUom',
  taxAmount: 'taxAmount',
  searchFieldName: {
    branch: 'branchCode',
    scrapStockNo: 'stockNo',
    createDate: 'createdDate',
    createdBy: 'createdBy',
    status: 'status',
    materialDescription: 'materialDes',
    materialDocument: 'materialDoc',
  },
  statusValue: {
    draft: '1',
    waitingApproval: '2',
    approved: '3',
    rejected: '4',
    completed: '5',
    closed: '6',
  },
  specialGroup: {
    materialGroup: 'materialGroup',
    value: '92010200',
  },
  materialTypeSearch: {
    display: 'Non-Valuated',
    value: 'Z92',
  },
  Quantity: 'Quantity',
  detailsInformation: 'Details Information',
  configDecimal: 3,
};

export const ActionBottomGridButtonConstant = {
  APPROVE: 'approve',
  CLOSE: 'close',
  PRINT: 'print',
  REJECT: 'reject',
  EDIT: 'edit',
  SAVE_DRAFT: 'saveDraft',
  SUBMIT: 'submit',
  CANCEL: 'cancel',
  CONFIRM_PICK_UP: 'confirmPickUp',
};

export const ConfigUploadFile = {
  acceptFile: 'image/jpg,image/png,image/jpeg',
  defaultValue: 4,
  maxUpload: 10,
  // 4MB
  maxSize: 4194304,
};
export const ConfigEntity = {
  MATERIAL: 'item',
  BOM_GROUP: 'bom_branch_group',
  BOM_BRANCH: 'bom_branch',
};

export const NumberConstant = {
  currency: 'Baht',
  decimalCharacter: '.',
  digitGroupSeparator: ',',
  numberDecimalCharacter: 2,
  normalDecimalCharacter: 2,
  maximumValue: 999999999.99,
  minimumValue: 0,
};

export const BranchBOM = {
  status: {
    draft: 1,
    confirmed: 2,
    unconfirmed: 3,
    active: 4,
    inactive: 5,
    expired: 6,
    closed: 7,
  },
  levels: {
    level_1: '1',
    level_2: '2',
    level_3: '3',
  },
  levelName: {
    level_1: 'Level 1',
    level_2: 'Level 2',
    level_3: 'Level 3',
  },
  statusName: {
    confirmed: 'confirm',
    unconfirmed: 'unconfirmed',
    active: 'active',
    inactive: 'inactive',
    closed: 'closed',
  },
  indicator: 'Indicator Finance',
  quantity: 'Quantity',
  categoryCode: 'categoryCode',
  level: 'level',
  existsInBranchBom: 1,
  category: {
    combo: '01',
  },
  quantityUnit: {
    KG: 'KG',
    Unit: 'Unit',
  },
  configDecimal: 3,
};

export const EntityConstant = {
  purchaseOrder: 'po_request',
};

export const Voucher = {
  internal: 'internal',
  physVoucher: 'P',
  e_Voucher: 'E',
  eVoucher: 'E-Voucher',
  pVoucher: 'P-Voucher',
  scanLabel: 'Scan',
  createLabel: 'Create',
  paginateParams: {
    CURRENT_PAGE: 1,
    COUNT_FLAG: 1,
    PAGE_SIZE: 3,
  },
  voucherActFieldName: {
    receiptNumber: 'receiptNumber',
    trackingNo: 'trackingNo',
    voucherStartDate: 'validFrom',
    voucherEndDate: 'validTo',
    soldTo: 'soldTo',
    shipTo: 'shipTo',
    customerPONo: 'customerCode',
  },
  voucherActLabelName: {
    receiptNumber: 'Sale Order No',
    trackingNo: 'Tracking No',
    voucherStartDate: 'Valid From',
    voucherEndDate: 'Valid To',
  },
  valuePackAllocationFieldName: {
    valuePackNo: 'valuePackNo',
    packName: 'packName',
    totalValue: 'totalValue',
  },
  createVoucherFieldName: {
    voucherPrefixType: 'refix_type',
    serialType: 'serial_type',
    promotion: 'promotion',
    validFrom: 'validFrom',
    validTo: 'validTo',
    validAfter: 'validAfter',
    validDuration: 'validDuration',
    activation: 'activation',
    applyOn: 'applyOn',
    totalVoucherQty: 'total',
    qtyPerBooklet: 'number',
    type: 'type',
    name: 'name',
  },
  typeOfSNPrefixVoucher: {
    cash: ['1', '5'],
    product: ['2', '6'],
  },
  statusValue: {
    completed: '1',
  },
  statusName: {
    active: 'Active',
    readyForSale: 'S-Ready for Sale',
  },
  valueOptionOfChannel: {
    b2b: 'B2B',
    b2c: 'B2C',
    internalUsing: 'INT',
  },
  typeOfSaleOrder: {
    zs01: 'ZS01',
    zs02: 'ZS02',
    zs03: 'ZS03',
  },
  statusOfSoDo: {
    a: 'A',
    b: 'B',
    c: 'C',
  },
};

export const PackVoucherConstant = {
  searchFieldName: {
    packNumber: 'packNumber',
    packName: 'packName',
    statusName: 'statusName',
    packNumberCustom: 'valuePackNo',
    packNameCustom: 'valuePackName',
    statusNameCustom: 'status',
  },
  status: {
    new: 'New',
    assigned: 'Assigned',
  },
  formatDate: 'DD.MM.YYYY',
};
export const CouponConstant = {
  internal: 'internal',
  physCoupon: 'Physical Coupon',
  status: 'couponDetailStatus',
  type: 'couponType',
  companyCode: 'companyCode',
  couponName: 'couponName',
  couponCode: 'couponCode',
  couponListValueType: 'couponValueType',
  promotionCode: 'promotionCode',
  paperCoupon: 'Paper - Leaflet',
  couponFieldName: {
    validFrom: 'validFrom',
    validTo: 'validTo',
  },
  defaultCompany: '1000',
  product: [4, 8],
  searchFieldName: {
    validFrom: 'validFrom',
    validTo: 'validTo',
    activeDate: 'activeDate',
    usedDate: 'usedDate',
    expiredDate: 'expiredDate',
    validDate: 'validDate',
    createdDate: 'createdDate',
    couponName: 'couponName',
    couponCode: 'couponCode',
    couponSerialNo: 'couponSerialNoDetail',
    couponType: 'couponType',
    couponValueType: 'couponValueType',
    promotionCode: 'promotionCode',
    couponStatus: 'couponDetailStatus',
    bookletCode: 'bookletCodeDetail',
    companyCode: 'companyCode',
    draftCoupon: {
      true: 1,
      false: 0,
    },
  },
  fieldsName: {
    name: 'name',
    type: 'type',
    companyCode: 'companyCode',
    serialCodeType: 'serialCodeType',
    serialCodeTypeElectronic: 'serialCodeTypeElectronic',
    serialCodeTypeReceipt: 'serialCodeTypeReceipt',
    validateDateType: 'validateDateType',
    totalCouponElectronic: 'totalCouponElectronic',
    totalCoupon: 'totalCoupon',
    numberOfCoupon: 'numberOfCoupon',
    systemRunning: 'systemRunning',
    yearPrefix: 'yearPrefix',
    prefixType: 'prefixType',
    serialNo: 'serialNo',
    issue: 'issue',
    yearYY: 'yearYY',
    serialType: 'serialType',
    couponValueTypeLeaflet: 'couponValueTypeLeaflet',
    couponValueType: 'couponValueType',
    validFrom: 'validFrom',
    validTo: 'validTo',
    validAfter: 'validAfter',
    validDuration: 'validDuration',
    promotion: 'promotion',
    note: 'note',
    applyOn: 'applyOn',
    amountValue: 'amountValue',
    percentageValue: 'percentageValue',
  },
  validateDateType: {
    fixDate: '1',
    determined: '2',
  },
  serialCodeType: {
    fix: '1',
    running: '2',
  },
  fieldEdit: {
    status: 'status',
    validFrom: 'validFrom',
    validTo: 'validTo',
    expired: 'E',
    active: 'A',
    blank: 'B',
    in_Active: 'I',
    ready_To_Sale: 'S',
    used: 'U',
  },
  statusName: {
    B: 'Blank',
    A: 'Active',
    S: 'Ready to Sale',
    U: 'Used',
    E: 'Expired',
    I: 'Inactive',
  },
  couponValueType: {
    amount: 'Amount',
    percentage: 'Percentage',
  },
  // Base on response API
  typeCoupon: {
    paperReceipt: '1',
    paperLeaflet: '2',
    Electronic: '3',
  },
  typeNameCoupon: {
    paperleft: 'Paper - Leaflet',
  },
  couponUpdated: {
    updated: 1,
  },
};

export const AddValuePackConstant = {
  voucherValueType: 'voucherValueType',
  quantity: 'quantity',
  value: 'value',
  valueUnit: 'Baht',
  totalValue: 'totalValue',
  fieldsLabel: {
    valuePackName: 'Value Pack Name',
    totalValue: 'Total Value',
    valuePackQty: 'Value Pack Qty',
    note: 'Note',
  },
};

export const ValuePackAllocationConstant = {
  valueUnit: 'Baht',
  invalidVoucherSerialNoMsgCodeFormServer: 'ERR_0212',
  generalFieldName: {
    quantity: 'quantity',
  },
};

export const BranchBOMPrice = {
  endDate: 'endDate',
  startDate: 'startDate',
  statusFld: 'status',
  categoryName: {
    restoPackaging: 'Resto Product Packaging',
  },
  listChannelCodeAllowRestoCategory: [
    '8', // take away
    '1', // Delivery
    '4', // 'Delivery grab',
    '5', // 'Delivery Lineman'
  ],
  levels: {
    level_1: '1',
    level_2: '2',
    level_3: '3',
  },
  status: {
    draft: 1,
    active: 2,
    inactive: 3,
    closed: 4,
    expired: 5,
    confirm: 6,
    unConfirm: 7,
  },
  taxCodes: {
    O7: 'O7',
    OX: 'OX',
  }
};

export const StockCount = {
  branch: 'branchCode',
  stockCountType: 'stockCountType',
  stockCountTypeValue: 'stockCountTypeValue',
  description: 'description',
  orderQuantity: 'orderQuantity',
  basedQuantity: 'basedQuantity',
  label: {
    branch: 'Branch',
    stockCountType: 'Stock Count Type',
    orderQuantity: 'Order Quantity',
    basedQuantity: 'Base Quantity',
    note: 'Note'
  },
  searchFieldName: {
    branch: 'branchCode',
    requestNo: 'requestNo',
    storageType: 'storageType',
    stockCountType: 'stockCountType',
    status: 'status',
    createdBy: 'createdBy',
    approvedBy: 'approvedBy',
    materialDocumentNo: 'materialDocumentNo',
    createdDate: 'createdDate',
  },
  statusName: {
    counting: 'Counting',
    draft: 'Draft',
    waitingForApproval: 'Waiting For Approval',
    rejected: 'Rejected',
    failed: 'Failed',
    approved: 'Approved',
    cancelled: 'Cancelled',
    closed: 'Closed',
    completed: 'Completed',
    inProcess: 'In-process',
  },
  statusValue: {
    draft: '1',
    counting: '2',
    waitingForApproval: '3',
    approved: '4',
    inProcess: '5',
    rejected: '6',
    failed: '7',
    cancelled: '8',
    closed: '9',
    completed: '10',
  },
};
//Good Issues start
export const GoodsIssuesConstant = {
  cancel: 'Cancel',
  ok: 'OK',
  status: 'status',
  goodsIssuesType: 'type',
  stringEmpty: '',
  btnAdd: 'Create Goods Issue',
  titleGoodsIssues: 'Goods Issues List',

  //Search
  searchFieldName: {
    department: 'departmentCode',
    goodsIssuesBranch: 'branchCode',
    giNo: 'goodsIssuesNumber',
    createdDate: 'createdDate',
    submittedDate: 'submittedDate',
    createdBy: 'createdBy',
    goodsIssuesType: 'type',
    goodsIssuesStatus: 'status',
    materialDocument: 'materialDocument',
    materialDescription: 'materialDescription',
  },
  label: {
    detailsInformation: 'Details Information',
    reason: 'Reason',
    internalOrder: 'Internal order',
    costCenter: 'Cost Center',
    note: 'Note',
    quantity: 'Quantity',
  },
  pageTitle: {
    goodsIssuesEdit: 'Edit Goods Issues',
    goodsIssuesAdd: 'Create Goods Issues',
  },
  types: {
    internal_order: '2',
    cost_center: '1',
  },
  // Detail page 1.Draft 2.Submitted 3.In-Process 4.Closed  5.Failed
  statusValue: {
    draft: '1',
    submitted: '2',
    inProcess: '3',
    closed: '4',
    failed: '5',
  },
  sku: 'sku',
  description: 'description',
  orderUnit: 'orderUnit',
  materialGroup: 'materialGroup',
  materialType: 'materialType',
  materialCode: 'materialCode',
  materialDescription: 'materialDescription',
  branchCode: 'branchCode',
  note: 'note',
  typeCode: 'typeCode',
  departmentCode: 'departmentCode',
  createdDate: 'createdDate',
  headerNote: 'headerNote',
  GIstatus: 'status',
  type: 'Type',
  branch: 'Branch',


  //number Constant
  numberConstant: {
    numberOfDraft: 1,
    numberOfClose: 4,
    numberOneNegative: -1,
  },

  // 0: all , draft: 1, submitted: 2,inProcess:3 ,closed: 4, failed: 5
  statusList: {
    draft: 'Draft',
    submitted: 'Submitted',
    inProcess: 'In-Process',
    closed: 'Closed',
    failed: 'Failed',
  }
};

export const AssetRequestConstant = {
  actionButtonGrid: {
    edit: '1',
    close: '2',
    reject: '3',
    approve: '4',
  },
  pageTitle: {
    assetRequestEdit: 'Edit Asset Request',
    assetRequestAdd: 'Create Asset Request',
  },
  searchItem: {
    assetType: 'assetType',
    assetCategory: 'assetCategory',
    assetSubCategory: 'assetSubCategory',
    assetDescription: 'assetDescription',
  },
  label: {
    detailsInformation: 'Details Information',
    note: 'Note',
    quantity: 'Quantity',
    deliveryDate: 'Delivery Date',
    assetCategory: 'Asset Category',
  },
  general: {
    requestFrom: 'branchCodeFrom',
    requestTo: 'branchCodeTo',
    ssdNo: 'ssdNo',
    note: 'notes',
  },
  note: 'notes',
  searchFieldName: {
    assetRequestNo: 'assetRequestNo',
    status: 'status',
    requestFrom: 'branchCodeFrom',
    requestTo: 'branchCodeTo',
    createdDate: 'createdDate',
    deliveryDate: 'deliveryDate',
    approvedBy: 'approvedBy',
    assetLocation: 'assetLocationCode',
  },
  status: {
    draft: 1,
    wait: 2,
    approved: 3,
    rejected: 4,
    closed: 5,
  },
  requestTo: 'Request To',
  requestFrom: 'Request From',
};

export const MasterDataConstant = {
  masterDataType: {
    stockCount: 'Stock Count',
    branchBom: 'Branch BOM',
    branchBomPrice: 'Branch BOM Price',
  },
  pageTitle: 'Master Data',
};

export const AssetTrackingConstant = {
  status: {
    confirm: 1,
    unConfirm: 2
  },
  statusName: {
    confirm: 'Confirmed',
    unConfirm: 'Unconfirmed',
  },
  searchFieldName: {
    assetTrackingStatus: 'status',
    assetTrackingCreateDate: 'createdDate',
  },
  //number Constant
  numberConstant: {
    numberOfDraft: 1,
    numberOfClose: 4,
    numberOneNegative: -1,
  },
};

export const UserConstant = {
  cancel: 'Cancel',
  ok: 'OK',
  searchFieldName: {
    userCode: 'userCode',
    fullName: 'fullName',
    roleCode: 'roleCode',
    branchCode: 'branchCode',
    departmentCode: 'departmentCode',
    telephone: 'telephone',
    email: 'email',
    position: 'position',
    division: 'division',
    employeeID: 'employeeID',
    username: 'username',
    accountStatus: 'accountStatus'
  },
};

export const POPettyCashConstant = {
  amount: 'amount',
  branch: 'branch',
  vat: 'vat',
  note: 'note',
  invoiceDate: 'invoiceDate',
  uploadFile: 'uploadFile',
  vendor: 'vendor',
  existedVendorName: 'existedVendorName',
  existedVendor: 'existedVendor',
  newVendor: 'newVendor',
  label: {
    detailsInformation: 'Details Information',
    branch: 'Branch',
    note: 'Note',
    quantity: 'Quantity',
    amount: 'Amount',
    vat: 'VAT',
    deliveryDate: 'Delivery Date',
    taxNo: 'Tax No.',
    country: 'Country',
    postalCode: 'Postal Code',
    city: 'City',
    address1: 'Address 1',
    name1: 'Name 1',
    existedVendorName: 'Existed Vendor Name',
    invoiceDate: 'Invoice Date',
    invoiceNo: 'Invoice No.',
  },
  statusValue: {
    draft: '1',
    waitingApproval: '2',
    approved: '3',
    closed: '4',
    rejected: '5',
  },
};


export const AssetReceiptConstant = {
  status: 'status',
  searchFieldName: {
    branch: 'branch',
    assetReceiptNo: 'assetReceiptNo',
    assetTransferNo: 'assetTransferNo',
    branchCodeFrom: 'from',
    createdBy: 'createdBy',
    createdDate: 'createdDate',
    submittedDate: 'submittedDate',
    statusType: 'status',
    fixzyNo: 'fixzySsdNo',
  },
};

export const MaterialUnitIsDecimal = [
  'KG',
  'L'
];

