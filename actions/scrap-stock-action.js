import scrapStockService from '../services/scrap-stock-service';

export function getScrapStockList(body) {
  return scrapStockService.getScrapStockList(body).then((res) => res);
}

export function deleteScrapStock(body) {
  return scrapStockService.deleteScrapStock(body).then((res) => res);
}

export function getBranchByUser(body) {
  return scrapStockService.getBranchByUser(body).then((res) => res);
}

export function getScrapStockStatus() {
  return scrapStockService.getScrapStockStatus().then((res) => res);
}

export function getMaterialType() {
  return scrapStockService.getMaterialType();
}

export function getMaterialGroup() {
  return scrapStockService.getMaterialGroup().then((res) => res.data);
}

export function getMaterialList(params) {
  return scrapStockService.getMaterialList(params);
}

export function saveScrapStock(body) {
  return scrapStockService.saveScrapStock(body).then((res) => res);
}

export function submitScrapStock(body) {
  return scrapStockService.submitScrapStock(body).then((res) => res);
}

export function updateScrapStock(body, type) {
  return scrapStockService.updateScrapStock(body, type).then((res) => res);
}

// Use for details page
export function getScrapStockDetailsById(body) {
  return scrapStockService.getScrapStockDetailsById(body).then((res) => res);
}

export function getScrapStockHistoryById(body) {
  return scrapStockService.getScrapStockHistoryById(body).then((res) => res);
}

export function getScrapStockPDF() {
  return scrapStockService.getScrapStockPDF();
}
