import assetReceiptService from '../services/asset-receipt-service';

export function getAssetReceiptList(body) {
  return assetReceiptService.getAssetReceiptList(body).then(res => res);
}

export function getBranchByUser(userId) {
  return assetReceiptService.getBranchByUser(userId).then(res => res);
}

export function getARStatus() {
  return assetReceiptService.getARStatus();
}

// Use for details page
export function getAssetReceiptDetailsById(body) {
  return assetReceiptService.getAssetReceiptDetailsById(body).then(res => res);
}

// Use for history section
export function getAssetReceiptHistoryData(id) {
  return assetReceiptService.getAssetReceiptHistoryData(id).then((res) => res);
}

export function addHistoryData(params) {
  return assetReceiptService.addHistoryData(params);
}
