import apiService from './api-service';
import { API_PATHS } from './service.config';

class EndOfDay {
  getMaterialConsumptionTable(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialConsumption,
      null,
      null,
      params
    );
  }

  submitMaterialConsumption(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.submitMaterialConsumption,
      null,
      null,
      params
    );
  }

  getEODRevenueTable(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getEODRevenue,
      null,
      null,
      params
    );
  }

  submitEODRevenue(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.submitEODRevenue,
      null,
      null,
      params
    );
  }
}

export default new EndOfDay();
