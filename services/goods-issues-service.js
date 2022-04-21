import apiService from './api-service';
import { API_PATHS } from './service.config';

class GoodsIssuesService {
  getGoodsIssuesList(param) {
    return apiService.makeRequest('post', API_PATHS.getGoodsIssuesList, {}, {}, param);
  };

  /**
   * Delete item good issues
   * @param {id} body 
   */
  deleteGoodsIssuesList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteGoodsIssuesValueByID,
      {},
      {},
      param
    );
  }

  /**
   * Get data goods issues Type
   */
  getGoodsIssuesType() {    

    return apiService.makeRequest('get',API_PATHS.getGoodsIssuesType,{});
  }

  getBranchByUser(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {},{},param);
  }

  /**
   * Get data goods issues Status
   */
  getGoodsIssuesStatus() { 
    return apiService.makeRequest('get', API_PATHS.getGoodsIssuesStatus, {});
  }

  saveGoodIssue(body, action, savingType) {
    if (action === 'insert') {
      if (savingType === 'draft') {
        return apiService.makeRequest(
          'post',
          API_PATHS.addGoodsIssues,
          {},
          {},
          body
        );
      } else {
        return apiService.makeRequest(
          'post',
          API_PATHS.submitGoodsIssues,
          {},
          {},
          body
        );
      }
    } else {
      if (savingType === 'draft') {
        return apiService.makeRequest(
          'post',
          API_PATHS.updateGoodsIssues,
          {},
          {},
          body
        );
      } else {
        return apiService.makeRequest(
          'post',
          API_PATHS.submitGoodsIssues,
          {},
          {},
          body
        );
      }
    }
  }

  getGoodsIssuesById(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getGoodsIssuesById.replace('@param', param)
    );
  }


  getValueGoodsIssuesDetails = (id) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getGoodsIssuesByID.replace('@goodsIssuesId', id)
    );
  };

  getHistoryData(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getGoodsIssuesByID.replace('@goodsIssuesId', id)
    );
  };

  updateGoodsIssuesStatus(updateStatus) {    
    return apiService.makeRequest('post',API_PATHS.updateGoodsIssuesStatus,{},{}, updateStatus);
  };

  getMaterialList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getGIMaterialList,
      {},
      {},
      param
    );
  }

  getGIBranch() { 
    return apiService.makeRequest('post', API_PATHS.getGIBranch, {});
  }

  //TODO dummy data
  getGIDepartment() {
    return Promise.resolve({
      data: [
        {
          value: 1,
          display: 'IT'
        },
        {
          value: 2,
          display: 'Accounting'
        },
        {
          value: 3,
          display: 'Engineer'
        },
      ]
    });
  }
}
export default new GoodsIssuesService();
