import apiService from './api-service';
import { API_PATHS } from './service.config';
import { AssetRequestConstant } from '../constants/constants';

class AssetRequestService {

  getAssetRequestList = (body) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetRequestList,
      {},
      {},
      body
    );
  };

  getAssetRequestStatus = () => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetRequestStatus
    );
  };

  getRequestBranch = (body) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAllBranchCombo,
      {},
      {},
      body
    );
  };

  getAssetLocation = () => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetLocation
    );
  };

  deleteAssetRequest = (body) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteAssetRequest,
      {},
      {},
      body
    );
  };

  updateStatusAssetRequest = (param, type) => {
    let url = '';

    switch (type) {
      case AssetRequestConstant.status.approved:
        url = API_PATHS.approveAssetRequest;
        break;
      case AssetRequestConstant.status.rejected:
        url = API_PATHS.rejectAssetRequest;
        break;
      case AssetRequestConstant.status.closed:
        url = API_PATHS.closeAssetRequest;
        break;
      default:
        break;
    }

    return apiService.makeRequest(
      'post',
      url,
      {},
      {},
      param
    );
  }

  getValueAssetRequestDetails = (id) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetRequestByID.replace('@assetRequestId', id)
    );
  };

  getAssetType = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetType);
  };

  getAssetCategory = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetCategory);
  };

  getAssetSubCategory = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetSubCategory);
  };

  getAssetItemList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetItemList,
      {},
      {},
      param
    );
  };

  saveAssetRequest(body, action, savingType) {
    if (action === 'insert') {
      return apiService.makeRequest(
        'post',
        API_PATHS.addAssetRequest,
        {},
        {},
        body
      );
    } else {
      return apiService.makeRequest(
        'post',
        API_PATHS.updateAssetRequest,
        {},
        {},
        body
      );
    }
  }
}
export default new AssetRequestService();
