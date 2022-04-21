import apiService from './api-service';
import { API_PATHS } from './service.config';

class StockCountService {
  getStockCountList(param) {
    return apiService.makeRequest('post', API_PATHS.getStockCountList, {}, {}, param);
  }

  deleteStockCount(param) {
    return apiService.makeRequest('post', API_PATHS.deleteStockCount, {}, {}, param);
  }

  getStorageType(param) {
    return apiService.makeRequest('get', API_PATHS.getStorageType, param);
    // return Promise.resolve({
    //   data: [
    //     {
    //       display: 'abc',
    //       value: 0,
    //     },
    //     {
    //       display: 'bca',
    //       value: 1,
    //     },
    //   ],
    //   param,
    // });
  }

  getStockCountType(param) {
    return apiService.makeRequest('get', API_PATHS.getStockCountType, param);
    // return Promise.resolve({
    //   data: [
    //     {
    //       display: 'Daily',
    //       value: 0,
    //     },
    //     {
    //       display: 'Weekly',
    //       value: 1,
    //     },
    //     {
    //       display: 'Monthly',
    //       value: 2,
    //     },
    //     {
    //       display: 'Yearly',
    //       value: 3,
    //     },
    //   ],
    //   param,
    // });
  }

  getAllStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getStockCountStatus, param);
    // return Promise.resolve({
    //   data: [
    //     {
    //       display: 'Open',
    //       value: 0,
    //     },
    //     {
    //       display: 'Counting',
    //       value: 1,
    //     },
    //     {
    //       display: 'In-progress',
    //       value: 2,
    //     },
    //     {
    //       display: 'Waiting for Approval',
    //       value: 3,
    //     },
    //     {
    //       display: 'Approved',
    //       value: 4,
    //     },
    //     {
    //       display: 'Rejected',
    //       value: 5,
    //     },
    //     {
    //       display: 'Closed',
    //       value: 6,
    //     },
    //   ],
    //   param,
    // });
  }

  getStockListForCounting(param) {
    return apiService.makeRequest('post', API_PATHS.getStockListForCounting, {}, {},  param);
    // return Promise.resolve({
    //   data: [
    //     {
    //       sku: '1234343',
    //       description: 'demo',
    //       typeName: 'typeName1',
    //       groupName: 'groupName1',
    //       orderQuantity: 3,
    //       baseQuantity: 1,
    //       orderUnit: 'PACK',
    //       baseUnit: 'EA',
    //       totalCounted: 0,
    //       stockOnHand: 3,
    //       gap: 0,
    //     }
    //   ]
    // });
  }

  saveStockCount(params, savingType) {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveStockCount,
      {},
      {},
      params
    );
  }

  getStockCountData(params) {
    return apiService.makeRequest('get', API_PATHS.getStockCountData, params);
    // return Promise.resolve({
    //   status: '200',
    //   data: {
    //     stockCountId: 1,
    //     branchCode: '1000',
    //     branchName: 'สำนักงานใหญ่',
    //     requestNo: 'SC000000001',
    //     stockCountTypeValue: 'N',
    //     description: 'Stock Count Dev',
    //     differentQuantity: 1,
    //     equalQuantity: 1,
    //     status: 1,
    //     statusName: 'Draft',
    //     createdDate: '20210125164754',
    //     updatedDate: '20210125164754',
    //     createdBy: 1,
    //     stockCountTypeName: 'Non-yearly',
    //     stockCountDetailVOs: [
    //       {
    //         stockCountDetailId: 1,
    //         stockCountId: 1,
    //         sku: '110000042',
    //         orderQuantity: 2,
    //         basedQuantity: 2,
    //         totalCounted: 2,
    //         stockOnHandQuantity: 2,
    //         gapQuantity: 2,
    //         description: 'dev',
    //         createdDate: '20210125184703',
    //         materialDescription: 'กะหล่ำปลี ขนาด 15กก./ถุง',
    //         materialType: 'Z11',
    //         materialGroup: '11010199',
    //         baseUnit: 'KG',
    //         orderUnit: 'BAG',
    //         denominator: 0,
    //         numerator: 0
    //       },
    //     ]
    //   }
    // });
  }

  getHistoryData(params) {
    return apiService.makeRequest('get', API_PATHS.getSCHistoryData, params);
    // return Promise.resolve({});
  }

  updateStockCountData(serverPath, params) {
    return apiService.makeRequest('post', serverPath, {}, {}, params);
  }

  importStockItem(params) {
    return apiService.makeRequest('post', API_PATHS.importStockItem, {}, {}, params);
  }

  updateStockCountStatus(params) {
    return apiService.makeRequest('post', API_PATHS.updateStockCountStatus, {}, {}, params);
  }

  getReason() {
    return apiService.makeRequest('get', API_PATHS.stockCountReason);
  }
}

export default new StockCountService();
