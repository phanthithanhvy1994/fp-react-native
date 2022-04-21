import apiService from './api-service';
import { API_PATHS } from './service.config';

class AssetTransfer {
  getDataRequestFrom = () => {
    return Promise.resolve({
      status: 200,
      data: [{
        id: 1,
        display: 'Request From 1',
        value: '1'
      },
      {
        id: 1,
        display: 'Request From 2',
        value: '1'
      }]
    });
  };
  getDataRequestTo = () => {
    return Promise.resolve({
      status: 200,
      data: [{
        id: 1,
        display: 'Request To 1',
        value: '1'
      },
      {
        id: 1,
        display: 'Request To 2',
        value: '1'
      }]
    });
  };
  getDataStatus = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetTransferStatus);
  };
  getDataType = () => {
    return apiService.makeRequest('get', API_PATHS.getAssetTransferType);
  };
  getDataSAP = () => {
    return Promise.resolve({
      status: 200,
      data: [
        {
          id: 1,
          display: 'SAP 1',
          value: '1',
        },
        {
          id: 1,
          display: 'SAP 2',
          value: '1',
        },
      ],
    });
  };
  getDataBBS = () => {
    return Promise.resolve({
      status: 200,
      data: [
        {
          id: 1,
          display: 'BBS 1',
          value: '1',
        },
        {
          id: 1,
          display: 'BBS 2',
          value: '1',
        },
      ],
    });
  };

  getAssetTransferList = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAssetTransferList,
      null,
      null,
      params
    );
  };

  getAssetTransferDetail = (id) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getAssetTransferByID.replace('@assetTransferId', id)
    );
  };
}

export default new AssetTransfer();
