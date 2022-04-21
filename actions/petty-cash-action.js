import poPettyCashService from '../services/petty-cash-service';

export function getMaterialType() {
  return poPettyCashService.getMaterialType();
}
  
export function getMaterialGroup() {
  return poPettyCashService.getMaterialGroup();
}
  
export function getMaterialList(params) {
  return poPettyCashService.getMaterialList(params);
}

export function uploadImages(params) {
  return poPettyCashService.uploadImages(params);
}

export function savePoPettyCash(body, action, savingType) {
  return poPettyCashService.savePoPettyCash(body, action, savingType);
}

export function getVendor(params) {
  return poPettyCashService.getVendor({});
}

export function rejectPettyCash(body) {
  return poPettyCashService.rejectPettyCash(body);
}

export function closePettyCash(body) {
  return poPettyCashService.closePettyCash(body);
}

export function getPettyCashList(body) {
  return poPettyCashService.getPettyCashList(body);
}

export function deletePettyCash(body) {
  return poPettyCashService.deletePettyCashById(body);
}
