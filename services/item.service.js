import apiService from './api-service';
import { API_PATHS } from './service.config';

class ItemService {
  getAllItem(body) {
    return apiService.makeRequest('post', API_PATHS.getAllItem, {}, {}, body);
  }

  getItem(param) {
    return apiService.makeRequest('get', API_PATHS.getItem, param);
  }

  addItem(body) {
    return apiService.makeRequest('post', API_PATHS.addItem, {}, {}, body);
  }

  updateItem(body) {
    return apiService.makeRequest('post', API_PATHS.updateItem, {}, {}, body);
  }

  deleteItem(body) {
    return apiService.makeRequest('delete', API_PATHS.deleteItem, {}, {}, body);
  }
}
export default new ItemService();
