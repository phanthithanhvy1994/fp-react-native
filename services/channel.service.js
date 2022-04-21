import apiService from './api-service';
import { API_PATHS } from './service.config';

class ChannelService {
  getAllChannel(params) {
    return apiService.makeRequest('get', API_PATHS.getAllChannel, params);
  }
}
export default new ChannelService();
