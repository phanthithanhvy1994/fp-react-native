import returnRequestService from '../services/return-request-service';

// User for List page
export function getReturnRequestList(body) {
  return returnRequestService.getReturnRequestList(body).then((res) => res);
}

export function deleteReturnRequest(params) {
  return returnRequestService.deleteReturnRequest(params);
}

export function getVendorByBranch(branch) {
  // const params = { branch };
  const params = {};
  return returnRequestService.getVendorByBranch(params);
}

export function getOrderType() {
  return returnRequestService.getOrderType();
}

export function getStatus() {
  return returnRequestService.getStatus();
}

export function getReason() {
  return returnRequestService.getReason();
}

// Use for details page
export function getReturnRequestDetailsById(params) {
  return returnRequestService
    .getReturnRequestDetailsById(params)
    .then((res) => res.data);
}

export function confirmReturnRequest(params) {
  return returnRequestService.confirmReturnRequest(params).then((res) => res);
}

export function closeReturnRequest(params) {
  return returnRequestService.closeReturnRequest(params).then((res) => res);
}

export function rejectReturnRequest(params) {
  return returnRequestService.rejectReturnRequest(params).then((res) => res);
}

export function approveReturnRequest(params) {
  return returnRequestService.approveReturnRequest(params).then((res) => res);
}

export function getBranchByLoggedUser() {
  return returnRequestService.getBranchByLoggedUser().then((res) => res);
}

export function getMaterialList(params) {
  return returnRequestService.getMaterialList(params);
}

export function saveReturnRequest(body, action, savingType) {
  return returnRequestService.saveReturnRequest(body, action, savingType);
}

export function getReturnRequestDetailsByGoodsReceiptNo(params) {
  return returnRequestService.getReturnRequestDetailsByGoodsReceiptNo(params);
}

export function getHistoryData(params) {
  return returnRequestService.getHistoryData(params);
}

export function uploadReturnRequestImages(body) {
  return returnRequestService.uploadReturnRequestImages(body);
}
