import apiService from './api-service';
import { API_PATHS } from './service.config';
class AssetTracking {
  getAssetTrackingDetails = (id) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetTrackingDetails.replace('@assetTrackingId', id)
    );
  };

  getAssetTrackingHistory = (id) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetTrackingHistory,
      {id: id}
    );
  };

  getDataStatus = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetTrackingStatus);
  };
  
  getAssetTrackingList = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetTrackingList,
      null,
      null,
      params
    );
  };
}

export default new AssetTracking();
