import masterDataService from '../services/master-data.service';

export function getStockCountExportData() {
  return masterDataService.getStockCountExportData();
}

export function importStockCountMasterData(body) {
  return masterDataService.importStockCountMasterData(body);
}
