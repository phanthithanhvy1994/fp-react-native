import apiService from './api-service';
import { API_PATHS } from './service.config';

class MasterDataService {
  getStockCountExportData(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getStockCountExportData,
      param
    );
  }

  importStockCountMasterData(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.importStockCountMasterData,
      {},
      {},
      body
    );
  }
}
export default new MasterDataService();
