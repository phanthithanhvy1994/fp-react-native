import apiService from './api-service';
import { API_PATHS } from './service.config';

class BranchService {
  getAllBranchCombo(body) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {}, {}, body);
  }
}
export default new BranchService();
