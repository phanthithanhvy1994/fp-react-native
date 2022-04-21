import goodsReceiptService from '../services/goods-receipt-service';

export function getGoodsReceiptList(body) {
  return goodsReceiptService.getGoodsReceiptList(body).then(res => res);
}

export function getBranchByUser(userId) {
  return goodsReceiptService.getBranchByUser(userId).then(res => res);
}

export function getGRStatus() {
  return goodsReceiptService.getGRStatus();
}

export function getGRType() {
  return goodsReceiptService.getGRType();
}

export function getGRVendor(body) {
  return goodsReceiptService.getGRVendor(body).then((res) => res);
}

// Use for details page
export function getGoodsReceiptDetailsById(body) {
  return goodsReceiptService.getGoodsReceiptDetailsById(body).then(res => res);
}

// Use for history section
export function loadHistoryListData(id) {
  return goodsReceiptService.loadHistoryListData(id).then((res) => res);
}

export function addHistoryData(params) {
  return goodsReceiptService.addHistoryData(params);
}
