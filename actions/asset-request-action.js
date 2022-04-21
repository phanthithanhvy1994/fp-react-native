import AssetRequestService from '../services/asset-request-service';

export function getAssetRequestList(body) {
  return AssetRequestService.getAssetRequestList(body);
}

export function getAssetRequestStatus() {
  return AssetRequestService.getAssetRequestStatus();
}

export function getAssetLocation() {
  return AssetRequestService.getAssetLocation();
}

export function getRequestBranch(body) {
  return AssetRequestService.getRequestBranch(body);
}

export function deleteAssetRequest(body) {
  return AssetRequestService.deleteAssetRequest(body);
}
export function getValueAssetRequestDetails(recordId) {
  return AssetRequestService.getValueAssetRequestDetails(recordId);
}
export function updateStatusAssetRequest(param, type) {
  return AssetRequestService.updateStatusAssetRequest(param, type);
}

export function getAssetType() {
  return AssetRequestService.getAssetType();
}

export function getAssetCategory() {
  return AssetRequestService.getAssetCategory();
}

export function getAssetSubCategory() {
  return AssetRequestService.getAssetSubCategory();
}

export function getAssetItemList(params) {
  return AssetRequestService.getAssetItemList(params);
}

export function saveAssetRequest(body, action, savingType) {
  return AssetRequestService.saveAssetRequest(body, action, savingType);
}