// const DOMAIN = 'http://147.50.130.88:8080/FlexBA-RMS_WebServices/services';
const DOMAIN = 'http://taytran2015:8080/FlexBA-RMS_WebServices';
const STATUS = {
  success: '200',
  badRequest: '400',
  unauthorizedAccess: '401',
  accessDenied: '403',
  notFound: '404 ',
  serverError: '500 ',
};
const API_PATHS = {
  // user
  getUser: '/services/user/staff/get',
  getUserByCode: '/services/user/staff/get_by_code',
  itemById: '/services/catalog/item/get',
  getPhoto: '/services/catalog/item/photo',

  // user role
  getAllUserRole: '/services/user/role/search',
  deleteUserRole: '/services/user/role/delete',
  updateUserRole: '/services/user/role/update',
  getUserRoleFeatures: '/services/user/operation/get_all',
  addUserRole: '/services/user/role/insert',
  getUserRole: '/services/user/role/get',

  getMaterialImage: '/services/catalog/item/photo',
  getMaterialList: '/services/catalog/item/search',
  // master data
  searchCategory: '/services/master/category/search',
  addCategory: '/services/master/category/insert',
  updateCategory: '/services/master/category/update_multi',
  deleteCategory: '/services/master/category/update_status',
  getTypeClass: '/services/master/type/get_by_class?typeClass=STOCK-TYPE',
  getMaterialCategory: '/services/catalog/category_list',
  // stock
  searchStock: '/services/inventory/search_stock_service',
  searchStockItem: '/services/inventory/stock_item/search',
  getStorageType:
    '/services/master/category/get_by_class?categoryClass=STORAGE_LOC',

  //Goods Issues
  deleteGoodsIssuesValueByID: '/services/goods_issues/delete',
  getGoodsIssuesStatus:
    '/services/master/type/get_by_class?typeClass=GOOD_ISSUES_STATUS',
  getGoodsIssuesType:
    '/services/master/type/get_by_class?typeClass=GOOD_ISSUES_TYPE',
  getGoodsIssuesList: '/services/goods_issues/search',
  addGoodsIssues: '/services/goods_issues/insert',
  updateGoodsIssues: '/services/goods_issues/update',
  getGoodsIssuesById: '/services/goods_issues/get?goodsIssuesId=@param',
  getGIMaterialList: '/services/goods_issues/search_item',
  getGIBranch: '/services/branch/search_combo',
  submitGoodsIssues: 'services/goods_issues/submit',

  // Goods Issues  Details
  getGoodsIssuesByID: '/services/goods_issues/get?goodsIssuesId=@goodsIssuesId',
  updateGoodsIssuesStatus: '/services/goods_issues/update', // Param is close

  // GR
  getBranchCode: '/services/master/counter_brand/get_all',
  getGoodsReceiptList: '/services/purchase/goods_receipt/search',
  getGoodsReceiptDetailsById: '/services/purchase/goods_receipt/get',
  getGRVendor: '/services/vendor/search_combo',
  getGRStatus:
    '/services/master/type/get_by_class?typeClass=GOOD_RECEIPT_STATUS',
  getGRType: '/services/master/type/get_by_class?typeClass=GOODS_RECEIPT_TYPE',
  getGRHistoryData: '/services/purchase/goods_receipt_history/search',

  // Purchase Order
  getPurchaseOrderList: '/services/purchase/po_request/search',
  getPurchaseOrder: '/services/purchase/po_request/get',
  getVendor: '/services/vendor/search_combo',
  getBranch: '/services/branch/search_combo',
  getStatus: '/services/master/type/get_by_class?typeClass=PO_STATUS',
  getOrderType: '/services/master/category/get_by_class?categoryClass=PO_TYPE',
  deletePurchaseOrder: '/services/purchase/po_request/delete',
  insertPurchaseOrder: '/services/purchase/po_request/insert',
  updatePurchaseOrder: '/services/purchase/po_request/update',
  submitPurchaseOrder: '/services/purchase/po_request/submit',
  approvePurchaseOrder: '/services/purchase/po_request/approve',
  getPOMaterialList: '/services/purchase/po_request/search_item',
  exportPO: '/services/export/po_request/pdf',
  getPOHistoryData: '/services/purchase/po_request_history/search',
  getMaxAmount: '/services/max_amount',
  getStorageTypeByDay: '/services/purchase/po_request/search_storage',

  // delivery order
  getAllDeliveryOrder: '/services/sales/do/search',
  getDeliveryOrder: '/services/sales/do/detail',
  addDeliveryOrder: '/services/sales/addDO',
  updateDeliveryOrder: '/services/sales/updateDO',
  deleteDeliveryOrder: '/services/sales/deleteDO',
  addComments: '/services/sales/addComment',
  getDeliveryOrderType: '/services/master/type/get_by_class?typeClass=DO_TYPE',
  getDeliveryOrderStatus:
    '/services/master/type/get_by_class?typeClass=DO_STATUS',

  // branch
  getBomBranchList: '/services/bom_branch/search',
  getBomBranchByID: '/services/bom_branch/get?id=@param',
  deletedBranchBom: '/services/bom_branch/delete',
  insertBranchBOM: '/services/bom_branch/insert',
  updateBranchBOM: '/services/bom_branch/update',
  getAllBranchCombo: '/services/branch/search_combo',

  getMaterialType:
    '/services/master/category/get_by_class?categoryClass=MATERIAL_TYPE',
  getDataProductType:
    '/services/master/category/get_by_class?categoryClass=PRODUCT_TYPE',
  getDataPriceType: '/services/master/type/get_by_class?typeClass=PRICE_TYPE',
  getDataCategoryType:
    '/services/master/type/get_by_class?typeClass=CATEGORY_TYPE',
  getDataSubCategoryType:
    '/services/master/category/get_by_class?categoryClass=SUB_CATEGORY_TYPE',
  getDataBomBranchLevelType:
    '/services/master/type/get_by_class?typeClass=BOM_BRANCH_LEVEL',
  getDataBomBranchQuantityType:
    '/services/master/category/get_by_class?categoryClass=QUANTITY_UNIT_TYPE',
  getDataStatusType:
    '/services/master/category/get_by_class?categoryClass=BOM_STATUS',
  getMaterialGroup: '/services/material_group/search_combo',
  getIndicatorType:
    '/services/master/type/get_by_class?typeClass=INDICATOR_TYPE',
  getCompanyCode: '/services/master/type/get_by_class?typeClass=COMPANY_CODE',
  getDivision: '/services/master/type/get_by_class?typeClass=BOM_DIVISION_TYPE',

  // return request
  getReturnRequestList: '/services/inventory/return_request/search',
  getReturnRequestById: '/services/inventory/return_request/get',
  confirmReturnRequest: '/services/inventory/return_request/completed?id=@param',
  closeReturnRequest: '/services/inventory/return_request/closed?id=@param',
  approveReturnRequest: '/services/inventory/return_request/approval?id=@param',
  rejectReturnRequest: '/services/inventory/return_request/rejected',
  saveDraftReturnRequest: '/services/inventory/return_request/insert',
  submitReturnRequest: '/services/inventory/return_request/submit_add',
  getRRMaterialList: '/services/inventory/return_request/search_item',
  getRRDetailsByGoodsReceiptNo:
    '/services/inventory/return_request/load_return_request_detail?goodReceiptNo=@param',
  deleteReturnRequest: '/services/inventory/return_request/deleted?id=@param',
  updateReturnRequest: '/services/inventory/return_request/update',
  getReturnRequestHistoryData:
    '/services/inventory/return_request_history/search',
  printReturnRequest: '/services/export/return_request/pdf',
  uploadReturnRequestImages: '/api/v1/upload_file',
  getReturnRequestReason:
    '/services/master/type/get_by_class?typeClass=RR_REASON_TYPE',
  getReturnRequestOrderType:
    '/services/master/type/get_by_class?typeClass=ORDER_TYPE',
  getReturnRequestStatus:
    '/services/master/type/get_by_class?typeClass=RR_STATUS',

  //branch bom group
  getBranchBOMGroupList: '/services/bomgroup/bom_group/search',
  getBranchBOMGroup: '/services/bomgroup/bom_group/view',
  addBranchBOMGroup: '/services/bomgroup/bom_group/insert',
  updateBranchBOMGroup: '/services/bomgroup/bom_group/update',
  deleteBranchBOMGroup: '/services/bomgroup/bom_group/delete',

  // branch bom price
  getBranchBOMPriceList: '/services/bom_price/search',
  getBranchBOMPrice: '/services/bom_price',
  addBranchBOMPrice: '/services/bom_price/save',
  updateBranchBOMPrice: '/services/bom_price/update',
  updateStatusBranchBOMPrice: 'services/bom_price/update_status',
  deleteBranchBOMPrice: '/services/bom_price/delete',
  getBranchBOMPriceStatus:
    '/services/master/category/get_by_class?categoryClass=BOM_PRICE_STATUS',
  getAllChannel:
    '/services/master/category/get_by_class?categoryClass=BOM_CHANNEL',
  getAllBranchGroup:
    '/services/master/type/get_by_class?typeClass=BRANCH_GROUP_TYPE',
  getCategoryType:
    '/services/master/category/get_by_class?categoryClass=CATEGORY_TYPE',
  getTaxCode: '/services/master/category/get_by_class?categoryClass=TAX_CODE',

  // item
  getPriceList: '/services/prices',
  getPrice: '/services/price',
  addPrice: '/services/price/add',
  updatePrice: '/services/price/update',
  deletePrice: '/services/price/delete',

  // channel
  getVoucher: '/services/voucher/get',

  // API call select
  getDataSelect: '/services/master/type/get_by_class?typeClass=@param',

  // scrap-stock
  getScrapStockPDF: '/services/export/po_request/pdf',
  getScrapStockList: '/services/inventory/transfer_request/search',
  getScrapStockDetailsById: '/services/inventory/transfer_request/get',
  getScrapStockHistoryById:
    '/services/inventory/transfer_request_history/search',
  deleteScrapStock: '/services/inventory/transfer_request/delete',
  saveScrapStock: '/services/inventory/transfer_request/save',
  submitScrapStock: '/services/inventory/transfer_request/submit',
  rejectScrapStock: '/services/inventory/transfer_request/reject',
  approveScrapStock: '/services/inventory/transfer_request/approve',
  closeScrapStock: '/services/inventory/transfer_request/close',
  printAssetTransfer: '/services/export/asset_transfer/pdf',
  getSSMaterialList: '/services/inventory/stock_item/search',
  getScrapStockStatus: '/services/master/type/get_by_class?typeClass=TR_STATUS',
  getSpecialMaterialGroup:
    '/services/master/type/get_by_class?typeClass=SPECIAL_MATERIAL_GROUP_TYPE',

  // Voucher
  getVoucherList: 'services/voucher/search',
  getVoucherDetail: 'services/voucher/get?id=@id',
  confirmVoucher: 'services/voucher/confirm?id=@id',
  getVoucherDetailGrid: 'services/voucher/search_detail',
  getVoucherName: 'services/voucher/search_name',
  getVoucherPromotion: 'services/voucher/promotion/get',
  getVoucherChannel:
    'services/master/type/get_by_class?typeClass=VOUCHER_CHANNEL',
  getVoucherStatus:
    'services/master/type/get_by_class?typeClass=VOUCHER_STATUS',
  getSaleOrder: '/services/sales/sale_order',
  getValueMatDesc: '/services/voucher/search_voucher_mat_des',
  exportVoucher: 'services/voucher/export',
  importVoucher: '/services/voucher/update',
  editVoucher: 'services/voucher/update_item_voucher',
  getScanVoucherData: '/services/voucher/scan',
  getSavedScannedVoucher: '/services/voucher/get_voucher_scanned',
  saveVoucherActivation: '/services/voucher/active_voucher',
  deleteAllScannedVoucher: '/services/voucher/delete_voucher_scanned',

  getOptions: {
    getEVoucherTypeSNPrefix:
      '/services/master/type/get_by_class?typeClass=E_VOUCHER_TYPE_SN_PREFIX',
    getPVoucherTypeSNPrefix:
      '/services/master/type/get_by_class?typeClass=P_VOUCHER_TYPE_SN_PREFIX',
    getSerialNo:
      '/services/master/type/get_by_class?typeClass=VOUCHER_SER_NO_DIGIT',
    getIssueBy:
      '/services/master/type/get_by_class?typeClass=VOUCHER_ISSUED_BY',
    getChannel: '/services/master/type/get_by_class?typeClass=VOUCHER_CHANNEL',
    getPromotion: '',
  },
  createVoucher: '/services/voucher/save',
  updateVoucher: '/services/voucher/update',
  // Pack Value
  getPackValueList: '/services/pack_voucher/search',
  getPackValueByID: '/services/pack_voucher/get?id=@id',
  deletePackValueByID: '/services/pack_voucher/delete',
  getValuePackTypeStatus:
    'services/master/category/get_by_class?categoryClass=PACK_VOUCHER_STATUS',
  getVoucherValueType:
    '/services/pack_voucher/get_combo_by_type?voucherType=P-Voucher',
  saveAddValuePack: '/services/pack_voucher/insert',

  // Pack Allocation
  getScanValuePackAllocationData: '/services/voucher/search_detail',
  getValuePackDetailByValuePackNo:
    '/services/pack_voucher/get_by_value_pack_no?valuePackNo=@param',
  saveValuePackAllocation: '/services/pack_voucher/update',

  // Coupon
  updateScanCouponList: '/services/coupon/update_detail',
  getScanCouponData: '/services/coupon/scan/get',
  getCouponScanInformation: '/services/coupon/search_detail',
  getCouponList: '/services/coupon/search',
  getCouponType: '/services/master/type/get_by_class?typeClass=COUPON_TYPE',
  getCouponTypeList:
    '/services/coupon/get_by_coupon_type?couponType=COUPON_TYPE',
  getCouponListValueType:
    '/services/master/type/get_by_class?typeClass=COUPON_VALUE_TYPE',
  getCouponStatus:
    '/services/master/category/get_by_class?categoryClass=COUPON_STATUS',
  getCouponPromotion: '/services/coupon/search_promotion',
  getCouponName: '/services/coupon/search_name',
  getCouponDetailsById: '/services/coupon/get',
  scanningCouponData: '/services/coupon/scan',
  deleteCoupon: '/services/coupon/save',
  exportCoupon: '/services/coupon/export',
  importCoupon: '/services/coupon/import',
  confirmCoupon: 'services/coupon/confirm?id=@id',
  editStatusCoupon: 'services/coupon/update_item',
  getCouponDetailGrid: 'services/coupon/search_detail',

  //End of Date
  getMaterialConsumption: '/services/consumpstion/get',
  submitMaterialConsumption: '/services/consumpstion/submit',
  getEODRevenue: '/services/revenue/get',
  submitEODRevenue: '/services/revenue/submit',
  getCouponTypeSNPrefix:
    '/services/master/type/get_combo_by_class?typeClass=COUPON_SN_PREFIX_TYPE',
  getCouponIssueType:
    '/services/master/category/get_by_class?categoryClass=COUPON_ISSUED_BY',
  getCouponSerialNo:
    '/services/master/category/get_by_class?categoryClass=COUPON_SERIAL_NO_DIGITS',
  getCouponValueType: '',
  saveCoupon: '/services/coupon/save',

  // Stock Count
  getStockCountList: '/services/stock_count/search',
  getStockListForCounting: '/services/stock_count/load_item',
  saveStockCount: '/services/stock_count/save',
  submitStockCount: '/services/stock-count/submit',
  getStockCountData: '/services/stock_count/get',
  getSCHistoryData: '/services/stock_count/load_history',
  getStockCountStatus:
    '/services/master/type/get_by_class?typeClass=STOCK_COUNT_STATUS',
  getStockCountType:
    '/services/master/type/get_by_class?typeClass=STOCK_COUNT_TYPE',
  deleteStockCount: '/services/stock_count/delete',
  closeStockCount: '/services/stock_count/close',
  approveStockCount: '/services/stock_count/approve',
  rejectStockCount: '/services/stock_count/reject',
  cancelStockCount: '/services/stock_count/cancel',
  importStockItem: '/services/stock_count/import_stock_item',
  updateStockCountStatus: '/services/stock_count/update_status',
  exportStockCount: '/services/export/stock_count/pdf',
  stockCountReason: '/services/master/type/get_by_class?typeClass=ST_REASON_TYPE',

  // Master Data
  getStockCountExportData: '/services/stock_count/export_master_stock_item',
  importStockCountMasterData: '/services/stock_count/import_master_stock_item',

  // Asset Transfer
  getAssetTransferList: '/services/asset_transfer/search',
  getAssetTransferType: '/services/master/type/get_combo_by_class?typeClass=ASSET_TRANSFER_TYPE',
  getAssetTransferStatus: '/services/master/type/get_combo_by_class?typeClass=ASSET_TRANSFER_STATUS',
  getAssetTransferByID: '/services/asset_transfer/get?id=@assetTransferId',


  // Asset Request
  getAssetRequestList: '/services/asset_request/search',
  getAssetLocation: '/services/asset_location/get_all',
  getAssetRequestStatus: '/services/master/type/get_by_class?typeClass=ASSET_REQUEST_STATUS',
  deleteAssetRequest: '/services/asset_request/delete',
  getAssetRequestByID: '/services/asset_request/get?id=@assetRequestId',
  closeAssetRequest: '/services/asset_request/close',
  rejectAssetRequest: '/services/asset_request/reject',
  approveAssetRequest: '/services/asset_request/approve',
  printAssetRequest: '/services/export/asset_request/pdf',
  getAssetType: '/services/master/category/get_by_class?categoryClass=ASSET_TYPE',
  getAssetCategory: '/services/master/category/get_by_class?categoryClass=ASSET_CATEGORY',
  getAssetSubCategory: '/services/master/category/get_by_class?categoryClass=ASSET_SUBCATEGORY',
  getAssetItemList: '/services/asset_request/search_item',
  addAssetRequest: '/services/asset_request/insert',
  updateAssetRequest: '/services/asset_request/update',

  // Asset Tracking
  getAssetTrackingDetails: '/services/asset_tracking/get?id=@assetTrackingId',
  getAssetTrackingHistory: '/services/asset_tracking/load_history',

  // Asset Tracking
  getAssetTrackingList: '/services/asset_tracking/search',
  getAssetTrackingStatus:'/services/master/type/get_combo_by_class?typeClass=ASSET_TRACKING_STATUS',	

  // Asset Receipt
  getAssetReceiptList: '/services/asset_receipt/search',
  getARStatus: '/services/master/type/get_by_class?typeClass=ASSET_RECEIPT_STATUS',
  getAssetReceiptDetailsById: '/services/asset_receipt/get',
  getAssetReceiptHistory: 'services/asset_receipt/load_history',

  // Petty Cash
  rejectPettyCash: 'service/petty/cash/reject',
  closePettyCash : 'service/petty/cash/close',
  deletePettyCash : 'service/petty/cash/delete',
};

const DEF_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const HTTP_METHODS = {
  post: 'post',
  get: 'get',
  put: 'put',
  delete: 'delete',
};
export { DOMAIN, STATUS, API_PATHS, DEF_HEADERS, HTTP_METHODS };
