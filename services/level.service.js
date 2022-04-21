import apiService from './api-service';
import { API_PATHS } from './service.config';

class LevelService {
  getAllLevel(body) {
    return apiService.makeRequest('get', API_PATHS.getAllLevel);
  }
}
export default new LevelService();
