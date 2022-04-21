import stockCountService from '../services/stock-count-service';

export function getStockCountList(body) {
  return stockCountService.getStockCountList(body).then(res => res);
}

export function deleteStockCount(body) {
  return stockCountService.deleteStockCount(body).then(res => res);
}

export function getAllBranch() {
  return stockCountService.getAllBranch().then(res => res);
}

export function getStockCountType(body) {
  return stockCountService.getStockCountType(body).then(res => res);
}

export function getAllStatus(body) {
  return stockCountService.getAllStatus(body).then(res => res);
}

export function getStorageType(body) {
  return stockCountService.getStorageType(body).then(res => res);
}

export function getStockListForCounting(body) {
  return stockCountService.getStockListForCounting(body).then(res => res);
}

export function saveStockCount(body, savingType) {
  return stockCountService.saveStockCount(body, savingType).then(res => res);
}

export function getStockCountData(params) {
  return stockCountService.getStockCountData(params).then(res => res);
}

export function getHistoryData(params) {
  return stockCountService.getHistoryData(params);
}

export function updateStockCountData(serverPath, params) {
  return stockCountService.updateStockCountData(serverPath, params);
}

export function importStockItem(params) {
  return stockCountService.importStockItem(params);
}

export function updateStockCountStatus(params) {
  return stockCountService.updateStockCountStatus(params);
}

export function getReason(params) {
  return stockCountService.getReason(params);
}
