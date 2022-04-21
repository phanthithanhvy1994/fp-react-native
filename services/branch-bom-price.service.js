import apiService from './api-service';
import { API_PATHS } from './service.config';

class BranchBOMPriceService {
  getAllBranchBOMPrice(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getBranchBOMPriceList,
      {},
      {},
      body
    );
  }

  getBranchBOMPrice(param) {
    return apiService.makeRequest('get', API_PATHS.getBranchBOMPrice, param);
  }

  getBranchBOMPriceFeatures(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getBranchBOMPriceFeatures,
      param
    );
  }

  addBranchBOMPrice(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.addBranchBOMPrice,
      {},
      {},
      body
    );
  }

  updateBranchBOMPrice(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.updateBranchBOMPrice,
      {},
      {},
      body
    );
  }

  updateStatusBranchBOMPrice(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.updateStatusBranchBOMPrice,
      {},
      {},
      body
    );
  }

  deleteBranchBOMPrice(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteBranchBOMPrice,
      {},
      {},
      body
    );
  }

  getBranchBOMPriceStatus(params) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getBranchBOMPriceStatus,
      params
    );
  }
}
export default new BranchBOMPriceService();
