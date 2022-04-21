import apiService from './api-service';
import { API_PATHS } from './service.config';

class GoodsReceiptService {
  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getGoodsReceiptList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGoodsReceiptList,
      {},
      {},
      param
    );
  }

  getGRType() {
    return apiService.makeRequest('get', API_PATHS.getGRType);
  }

  getGRStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getGRStatus, param);
  }

  getGRVendor(param) {
    return apiService.makeRequest('post', API_PATHS.getGRVendor, param || {});
  }

  // Service Detail Page

  getGoodsReceiptDetailsById(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getGoodsReceiptDetailsById,
      param
    );
  }

  loadHistoryListData(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGRHistoryData,
      {},
      {},
      id
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

export default new GoodsReceiptService();
