import CouponService from '../services/coupon-service';

export function getCouponList(body) {
  return CouponService.getCouponList(body).then((res) => res);
}

export function getCouponExport() {
  return CouponService.getCouponExport();
}

export function getCouponName() {
  return CouponService.getCouponName();
}

export function getCouponStatus() {
  return CouponService.getCouponStatus();
}

export function editStatusCoupon(body) {
  return CouponService.editStatusCoupon(body);
}

export function getCouponType() {
  return CouponService.getCouponType();
}

export function getCouponTypeList() {
  return CouponService.getCouponTypeList();
}

export function getCouponListValueType() {
  return CouponService.getCouponListValueType();
}

export function getCompanyCode() {
  return CouponService.getCompanyCode();
}

export function getCouponTypeSNPrefix() {
  return CouponService.getCouponTypeSNPrefix();
}

export function getSerialNo() {
  return CouponService.getSerialNo();
}

export function getIssueType() {
  return CouponService.getIssueType();
}

export function getCouponValueType(body) {
  return CouponService.getCouponValueType(body);
}

export function getCouponPromotion() {
  return CouponService.getCouponPromotion();
}

export function saveCoupon(body) {
  return CouponService.saveCoupon(body);
}

export function confirmCoupon(id) {
  return CouponService.confirmCoupon(id);
}

export const getCoupon = (params) => {
  return CouponService.getCoupon(params);
};

export const getCouponScanInformation = (params) => {
  return CouponService.getCouponScanInformation(params);
};

export function scanningCouponData(params) {
  return CouponService.scanningCouponData(params);
}

export function updateScanCouponList(params) {
  return CouponService.updateScanCouponList(params);
}

export function importCoupon(params) {
  return CouponService.importCoupon(params);
}

export function exportCoupon(params) {
  return CouponService.exportCoupon(params);
}

// Use for details page
export function getCouponDetailsById(body) {
  return CouponService.getCouponDetailsById(body).then((res) => res);
}

export function deleteCoupon(body) {
  return CouponService.deleteCoupon(body).then((res) => res);
}

export function getCouponDetailGrid(params) {
  return CouponService.getCouponDetailGrid(params).then((res) => res);
}
