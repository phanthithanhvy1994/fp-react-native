import apiService from './api-service';
import { API_PATHS } from './service.config';

class BranchBOMGroupService {
  getAllBranchBOMGroup(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getBranchBOMGroupList,
      {},
      {},
      body
    );
  }

  getBranchBOMGroup(params) {
    return apiService.makeRequest('get', API_PATHS.getBranchBOMGroup, params);
  }

  addBranchBOMGroup(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.addBranchBOMGroup,
      {},
      {},
      body
    );
  }

  updateBranchBOMGroup(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.updateBranchBOMGroup,
      {},
      {},
      body
    );
  }

  deleteBranchBOMGroup(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteBranchBOMGroup,
      {},
      {},
      body
    );
  }
}
export default new BranchBOMGroupService();
