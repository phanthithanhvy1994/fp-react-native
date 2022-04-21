import apiService from './api-service';
import { API_PATHS } from './service.config';

class DeliveryOrderService {
  getAllDeliveryOrder(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getAllDeliveryOrder,
      {},
      {},
      body
    );
  }

  getDeliveryOrder(param) {
    return apiService.makeRequest('get', API_PATHS.getDeliveryOrder, param);
  }

  getDeliveryOrderStatus() {
    return apiService.makeRequest('get', API_PATHS.getDeliveryOrderStatus);
  }

  getDeliveryOrderType() {
    return apiService.makeRequest('get', API_PATHS.getDeliveryOrderType);
  }
}
export default new DeliveryOrderService();
