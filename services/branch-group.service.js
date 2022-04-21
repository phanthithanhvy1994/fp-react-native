import apiService from './api-service';
import { API_PATHS } from './service.config';

class BranchGroupService {
  getAllBranchGroup(params) {
    return apiService.makeRequest('get', API_PATHS.getAllBranchGroup, params);
  }
}
export default new BranchGroupService();
