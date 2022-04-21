import VoucherService from '../services/voucher-service';

export const getVoucher = params => {
  return VoucherService.getVoucher(params);
};
export function getVoucherList(body) {
  return VoucherService.getVoucherList(body);
}

export function getVoucherName() {
  return VoucherService.getVoucherName();
}

export function getVoucherChannel() {
  return VoucherService.getVoucherChannel();
}

export function getVoucherPromotion() {
  return VoucherService.getVoucherPromotion();
}

export function getVoucherStatus() {
  return VoucherService.getVoucherStatus();
}

export function getSOInformation(params) {
  return VoucherService.getSOInformation(params);
}

export function getSaleOrder(params) {
  return VoucherService.getSaleOrder(params);
}

export function getEVoucherTypeSNPrefix() {
  return VoucherService.getEVoucherTypeSNPrefix();
}
export function getPVoucherTypeSNPrefix() {
  return VoucherService.getPVoucherTypeSNPrefix();
}

export function getSerialNo() {
  return VoucherService.getSerialNo();
}

export function getIssueBy() {
  return VoucherService.getIssueBy();
}

export function getCompanyCode() {
  return VoucherService.getCompanyCode();
}

export function getChannel() {
  return VoucherService.getChannel();
}

export function getVoucherValueType(body) {
  return VoucherService.getVoucherValueType(body);
}

export function createVoucher(body) {
  return VoucherService.createVoucher(body);
}

export function updateVoucher(body) {
  return VoucherService.updateVoucher(body);
}

export function getValuePackDetails(id, params) {
  return VoucherService.getValuePackDetails(id, params);
}

export function getScanVoucherData(params) {
  return VoucherService.getScanVoucherData(params);
}

export function getPackValueList(body) {
  return VoucherService.getPackValueList(body);
}

export function getValuePackTypeStatus() {
  return VoucherService.getValuePackTypeStatus();
}

export function deletePackValue(param) {
  return VoucherService.deletePackValue(param);
}

export function getPackValueExport() {
  return VoucherService.getPackValueExport();
}

export function getVoucherMatDesc() {
  return VoucherService.getVoucherMatDesc();
}

export function exportVoucherExternal(params) {
  return VoucherService.exportVoucherExternal(params);
}

export function importVoucher(params) {
  return VoucherService.importVoucher(params);
}

export function confirmVoucher(params) {
  return VoucherService.confirmVoucher(params);
}

export function getVoucherDetailGrid(params) {
  return VoucherService.getVoucherDetailGrid(params);
}

export function editVoucher(params) {
  return VoucherService.editVoucher(params);
}

export function getSavedScannedVoucher(params) {
  return VoucherService.getSavedScannedVoucher(params);
}

export function saveVoucherActivation(params) {
  return VoucherService.saveVoucherActivation(params);
}

export function deleteAllScannedVoucher(params) {
  return VoucherService.deleteAllScannedVoucher(params);
}
