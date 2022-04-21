import apiService from './api-service';
import { DOMAIN, API_PATHS } from './service.config';

class ScrapStockService {
  getScrapStockList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getScrapStockList,
      {},
      {},
      param
    );
  }

  deleteScrapStock(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteScrapStock,
      {},
      {},
      id
    );
  }

  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getScrapStockStatus() {
    return apiService.makeRequest('get', API_PATHS.getScrapStockStatus);
  }

  getMaterialType(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getMaterialType,
      param || {}
    );
  }

  getMaterialGroup(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialGroup,
      param || {}
    );
  }

  getMaterialList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getSSMaterialList,
      {},
      {},
      param
    );
  }

  // Service Detail Page

  getScrapStockDetailsById(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getScrapStockDetailsById,
      param
    );
  }
  getScrapStockHistoryById(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getScrapStockHistoryById,
      {},
      {},
      param
    );
  }

  saveScrapStock(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveScrapStock,
      {},
      {},
      param
    );
  }

  submitScrapStock(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.submitScrapStock,
      {},
      {},
      param
    );
  }

  updateScrapStock(param, type) {
    let apiPath = API_PATHS.closeScrapStock;
    if (type.isApproved) {
      apiPath = API_PATHS.approveScrapStock;
    } else if (type.isRejected) {
      apiPath = API_PATHS.rejectScrapStock;
    }
    return apiService.makeRequest('post', apiPath, {}, {}, param);
  }

  getScrapStockPDF() {
    return `${DOMAIN}${API_PATHS.getScrapStockPDF}`;
  }
}

export default new ScrapStockService();
