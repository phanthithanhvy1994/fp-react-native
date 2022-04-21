import apiService from './api-service';
import { API_PATHS } from './service.config';

class ValuePackAddService {
  addNewValuePack = (body) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveAddValuePack,
      {},
      {},
      body
    );
  };

  getVoucherValueType() {
    return apiService.makeRequest('get', API_PATHS.getVoucherValueType);
  }
}

export default new ValuePackAddService();
