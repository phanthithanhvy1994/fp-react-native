import apiService from './api-service';
import { API_PATHS } from './service.config';

class UserRoleService {
  getAllUserRole(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAllUserRole,
      {},
      {},
      body
    );
  }

  deleteUserRole(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteUserRole,
      {},
      {},
      body
    );
  }

  updateUserRole(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.updateUserRole,
      {},
      {},
      body
    );
  }

  getUserRoleFeatures(param) {
    return apiService.makeRequest('get', API_PATHS.getUserRoleFeatures, param);
  }

  addUserRole(body) {
    return apiService.makeRequest('post', API_PATHS.addUserRole, {}, {}, body);
  }

  getUserRole(param) {
    return apiService.makeRequest('get', API_PATHS.getUserRole, param);
  }
}
export default new UserRoleService();
