import apiService from './api-service';
import { API_PATHS } from './service.config';

class ValuePackAllocationService {
  getVPAllocationInformation(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getValuePackDetailByValuePackNo.replace('@param', param),
      {}
    );
  }

  getScanValuePackAllocationData = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getScanValuePackAllocationData,
      {},
      {},
      params
    );
  };

  saveValuePackAllocation = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveValuePackAllocation,
      {},
      {},
      params
    );
  };
}

export default new ValuePackAllocationService();
