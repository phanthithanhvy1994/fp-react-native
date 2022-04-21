import apiService from './api-service';
import { API_PATHS } from './service.config';

class BranchBOMPRiceService {
  getAllPrice(body) {
    return apiService.makeRequest('post', API_PATHS.getAllPrice, {}, {}, body);
  }

  getPrice(param) {
    return apiService.makeRequest('get', API_PATHS.getPrice, param);
  }

  addPrice(body) {
    return apiService.makeRequest('post', API_PATHS.addPrice, {}, {}, body);
  }

  updatePrice(body) {
    return apiService.makeRequest('post', API_PATHS.updatePrice, {}, {}, body);
  }

  deletePrice(body) {
    return apiService.makeRequest(
      'delete',
      API_PATHS.deletePrice,
      {},
      {},
      body
    );
  }
}
export default new BranchBOMPRiceService();
