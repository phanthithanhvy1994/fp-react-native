import apiService from './api-service';
import { API_PATHS } from './service.config';
import { Action } from '../constants/constants';

class BranchBomService {
  getBranchBomList(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getBomBranchList,
      null,
      null,
      params
    );
  }

  getItemDetail(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getBomBranchByID.replace('@param', id)
    );
  }

  getMaterial(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getMaterialList,
      {},
      {},
      body
    );
  }

  deletedBranchBom(id) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deletedBranchBom,
      {},
      {},
      id
    );
  }

  insertBranchBOM(body, savingType) {
    return apiService.makeRequest(
      'post',
      savingType === Action.insert
        ? API_PATHS.insertBranchBOM
        : API_PATHS.updateBranchBOM,
      {},
      {},
      body
    );
  }

  getBomGroupList(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getBomGroupList,
      null,
      null,
      params
    );
  }

  getMaterialType() {
    return apiService.makeRequest('get', API_PATHS.getMaterialType);
  }

  getDataProductType() {
    return apiService.makeRequest('get', API_PATHS.getDataProductType);
  }

  getDataPriceType() {
    return apiService.makeRequest('get', API_PATHS.getDataPriceType);
  }

  getDataCategoryType() {
    return apiService.makeRequest('get', API_PATHS.getCategoryType);
  }

  getDataSubCategoryType() {
    return apiService.makeRequest('get', API_PATHS.getDataSubCategoryType);
  }

  getDataBomBranchLevelType() {
    return apiService.makeRequest('get', API_PATHS.getDataBomBranchLevelType);
  }

  getDataBomBranchQuantityType() {
    return apiService.makeRequest(
      'get',
      API_PATHS.getDataBomBranchQuantityType
    );
  }

  getDataStatusType() {
    return apiService.makeRequest('get', API_PATHS.getDataStatusType);
  }

  getDataCompanyCode() {
    return apiService.makeRequest('get', API_PATHS.getCompanyCode);
  }

  getDataIndicator() {
    return apiService.makeRequest('get', API_PATHS.getIndicatorType);
  }

  getDataDivision() {
    return apiService.makeRequest('get', API_PATHS.getDivision);
  }

  getDataTaxCode() {
    return apiService.makeRequest('get', API_PATHS.getTaxCode);
  }
}

export default new BranchBomService();
