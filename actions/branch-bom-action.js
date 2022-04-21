import BranchBomService from '../services/branch-bom-service';

export function getBranchBomList(body) {
  return BranchBomService.getBranchBomList(body);
}

export function getItemDetail(id) {
  return BranchBomService.getItemDetail(id);
}

export function getDataSelectMultiple(param) {
  return BranchBomService.getDataSelectMultiple(param);
}

export function insertBranchBOM(body, savingType) {
  return BranchBomService.insertBranchBOM(body, savingType);
}

export function getMaterial(param) {
  return BranchBomService.getMaterial(param);
}

export function deletedBranchBom(id) {
  return BranchBomService.deletedBranchBom(id);
}

export function getBranchBom() {
  return BranchBomService.getBranchBom();
}

export function getMaterialType(param) {
  return BranchBomService.getMaterialType(param);
}

export function getDataProductType(param) {
  return BranchBomService.getDataProductType(param);
}

export function getDataPriceType(param) {
  return BranchBomService.getDataPriceType(param);
}

export function getDataCategoryType(param) {
  return BranchBomService.getDataCategoryType(param);
}

export function getDataSubCategoryType(param) {
  return BranchBomService.getDataSubCategoryType(param);
}

export function getDataBomBranchLevelType(param) {
  return BranchBomService.getDataBomBranchLevelType(param);
}

export function getDataBomBranchQuantityType(param) {
  return BranchBomService.getDataBomBranchQuantityType(param);
}

export function getDataStatusType(param) {
  return BranchBomService.getDataStatusType(param);
}

export function getDataCompanyCode(param) {
  return BranchBomService.getDataCompanyCode(param);
}

export function getDataIndicator(param) {
  return BranchBomService.getDataIndicator(param);
}

export function getDataDivision(param) {
  return BranchBomService.getDataDivision(param);
}

export function getDataTaxCode(param) {
  return BranchBomService.getDataTaxCode(param);
}
