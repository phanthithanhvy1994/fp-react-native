import apiService from './api-service';
import { DOMAIN, API_PATHS } from './service.config';

class MaterialService {
  getMaterialList(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialList,
      {},
      {},
      body
    );
  }

  getMaterialImage() {
    return `${DOMAIN}${API_PATHS.getPhoto}`;
  }

  getMaterialType() {
    return apiService.makeRequest('get', API_PATHS.getMaterialType);
  }

  getMaterialGroup(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialGroup,
      param || {}
    );
  }

  getMaterialDetail(body) {
    return apiService.makeRequest('get', API_PATHS.itemById, body);
  }
}

export default new MaterialService();
