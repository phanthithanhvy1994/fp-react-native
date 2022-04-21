import apiService from './api-service';
import { API_PATHS } from './service.config';
import { Action } from '../constants/constants';

class PurchaseOrderService {
  getPurchaseOrderList(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getPurchaseOrderList,
      null,
      null,
      params
    );
  }

  getPurchaseOrder(params) {
    return apiService.makeRequest('get', API_PATHS.getPurchaseOrder, params);
  }

  getVendorByBranch(param) {
    return apiService.makeRequest('post', API_PATHS.getVendor, param || {});
  }

  getUserList(branch) {
    // let param = branch ? { branchCode: branch } : [];

    // return apiService.makeRequest('get', API_PATHS.getVendor, param);
    let data = [];

    if (branch) {
      data = [
        { value: 1, display: 'user 1' },
        { value: 2, display: 'user 2' },
        { value: 4, display: 'user 4' },
      ];
    } else {
      data = [
        { value: 1, display: 'user 1' },
        { value: 2, display: 'user 2' },
        { value: 3, display: 'user 3' },
        { value: 4, display: 'user 4' },
        { value: 5, display: 'user 5' },
      ];
    }
    return Promise.resolve({
      data,
    });
  }

  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
  }

  getOrderType() {
    return apiService.makeRequest('get', API_PATHS.getOrderType);
  }

  getStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getStatus, param || {});
  }

  deletePurchaseOrder(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deletePurchaseOrder,
      {},
      {},
      {
        id,
      }
    );
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

  // Sample for testing common component,
  // will be replace with function in material-service later
  getMaterialList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getPOMaterialList,
      {},
      {},
      param
    );
  }

  savePurchaseOrder(params, savingType) {
    return apiService.makeRequest(
      'post',
      savingType === Action.insert
        ? API_PATHS.insertPurchaseOrder
        : (savingType === Action.submit ?
          API_PATHS.submitPurchaseOrder : API_PATHS.updatePurchaseOrder),
      {},
      {},
      params
    );
  }

  getHistoryData(params) {
    return apiService.makeRequest('post', API_PATHS.getPOHistoryData, {}, {}, params);
  }

  getMaxAmount(params) {
    // return apiService.makeRequest('post', API_PATHS.getMaxAmount, {}, {}, params);
    return Promise.resolve({
      status: 200,
      maxAmount: 1000
    });
  }

  getStorageType(params) {
    return apiService.makeRequest('post', API_PATHS.getStorageTypeByDay, {}, {}, params);
  }

  approve(params) {
    return apiService.makeRequest('post', API_PATHS.approvePurchaseOrder, {}, {}, params);
  }
}

export default new PurchaseOrderService();
