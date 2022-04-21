import purchaseOrderService from '../services/purchase-order-service';

export function getPurchaseOrderList(body) {
  return purchaseOrderService.getPurchaseOrderList(body);
}

export function getPurchaseOrder(body) {
  return purchaseOrderService.getPurchaseOrder(body);
}

export function getVendorByBranch(branch) {
  // const param = { branch };
  const param = {};
  return purchaseOrderService.getVendorByBranch(param);
}

export function getUserList(branch) {
  return purchaseOrderService.getUserList(branch);
}

export function getBranchByUser(userId) {
  return purchaseOrderService.getBranchByUser(userId);
}

export function getOrderType() {
  return purchaseOrderService.getOrderType();
}

export function getStatus() {
  return purchaseOrderService.getStatus();
}

export function deletePurchaseOrder(id) {
  return purchaseOrderService.deletePurchaseOrder(id);
}

export function getMaterialType() {
  return purchaseOrderService.getMaterialType();
}

export function getMaterialGroup() {
  return purchaseOrderService.getMaterialGroup();
}

export function getMaterialList(params) {
  return purchaseOrderService.getMaterialList(params);
}

export function savePurchaseOrder(params, savingType) {
  return purchaseOrderService.savePurchaseOrder(params, savingType);
}

export function getHistoryData(params) {
  return purchaseOrderService.getHistoryData(params);
}

export function getMaxAmount(params) {
  return purchaseOrderService.getMaxAmount(params);
}

export function getStorageType(params) {
  return purchaseOrderService.getStorageType(params);
}

export function approvePurchaseOrder(params) {
  return purchaseOrderService.approve(params);
}
