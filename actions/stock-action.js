import StockService from '../services/stock.service';

export function searchStockItem(body) {
  return StockService.searchStockItem(body);
}

export function getImage() {
  return StockService.getImage();
}

export function getBranchByUser() {
  return StockService.getBranchByUser();
}

export function getStorageType() {
  return StockService.getStorageType();
}

export function getMaterialGroup() {
  return StockService.getMaterialGroup();
}
