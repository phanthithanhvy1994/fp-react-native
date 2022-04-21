import apiService from './api-service';
import { API_PATHS } from './service.config';

class AssetReceiptService {
  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getAssetReceiptList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetReceiptList,
      {},
      {},
      param
    );
  }

  getGRType() {
    return apiService.makeRequest('get', API_PATHS.getGRType);
  }

  getARStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getARStatus, param);
  }

  getGRVendor(param) {
    return apiService.makeRequest('post', API_PATHS.getGRVendor, param || {});
  }

  // Service Detail Page

  getAssetReceiptDetailsById(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetReceiptDetailsById,
      param
    );
  }

  getAssetReceiptHistoryData(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetReceiptHistory,
      {id:id},
    );
  }

  addHistoryData(params) {
    const historyListData = [
      { time: new Date(), note: 'test note 1' },
      { time: new Date(), note: 'test note 2' },
      { time: new Date(), note: 'test note 3' },
    ];

    const historyData = {
      time: new Date(),
      note: params,
    };

    historyListData.unshift(historyData);

    return Promise.resolve(historyListData);
  }
}

export default new AssetReceiptService();
