import apiService from './api-service';
import { API_PATHS, DOMAIN } from './service.config';

class StockService {
  searchStockItem(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.searchStock,
      null,
      null,
      body
    );
  }

  getImage() {
    return `${DOMAIN}${API_PATHS.getPhoto}`;
  }

  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getStorageType() {
    return apiService.makeRequest('get', API_PATHS.getStorageType);
  }

  getMaterialGroup(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialGroup,
      param || {}
    );
  }
}
export default new StockService();
