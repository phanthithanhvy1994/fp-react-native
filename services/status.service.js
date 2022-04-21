import apiService from './api-service';
import { API_PATHS } from './service.config';

class StatusService {
  getAllStatus(body) {
    return apiService.makeRequest('post', API_PATHS.getStatus, {}, {}, body);
  }
}
export default new StatusService();
