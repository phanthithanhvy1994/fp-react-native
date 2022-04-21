import apiService from './api-service';
import { API_PATHS } from './service.config';

class ReturnRequestService {
  // All data is temp data, will update when BE is done
  getReturnRequestList(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getReturnRequestList,
      {},
      {},
      body
    );
  }

  getReturnRequestDetailsById(params) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getReturnRequestById,
      params
    );
    // let data;
    // if (params.id === '1') {
    //   data = {
    //     branch: 'test1',
    //     orderType: 'Return to factory',
    //     goodsReceiptNo: 'test1',
    //     vendor: 'test1',
    //     approver: 'test1',
    //     status: 'Waiting for Approval',
    //     note: 'test1',
    //     scanningTimeLine: [
    //       {
    //         time: Date.now(),
    //         userCode: '0000000',
    //         name: 'test06554521',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUsera5645454545',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '2222222',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUserEnd',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //       {
    //         time: Date.now(),
    //         userCode: '31101996',
    //         name: 'testUser',
    //       },
    //     ],
    //     data: [
    //       {
    //         no: 1,
    //         receiptQty: 1,
    //         returnQty: 1,
    //         reason: 'test reason 1',
    //         description: 'test description 1',
    //         materialCode: 'M200',
    //         materialDescription: 'MMMMMMMM',
    //         productUnit: 2,
    //         type: 'HHHH',
    //         group: 'DDD',
    //         common: {
    //           imgUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
    //         },
    //       },
    //       {
    //         no: 2,
    //         receiptQty: 1,
    //         returnQty: 1,
    //         reason: 'test reason 2',
    //         description: 'test description 2',
    //         materialCode: 'M200',
    //         materialDescription: 'MMMMMMMM',
    //         productUnit: 2,
    //         type: 'HHHH',
    //         group: 'DDD',
    //         common: {
    //           imgUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
    //         },
    //       },
    //       {
    //         no: 3,
    //         receiptQty: 1,
    //         returnQty: 1,
    //         reason: 'test reason 3',
    //         description: 'test description 3',
    //         materialCode: 'M200',
    //         materialDescription: 'MMMMMMMM',
    //         productUnit: 2,
    //         type: 'HHHH',
    //         group: 'DDD',
    //         common: {
    //           imgUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
    //         },
    //       },
    //     ],
    //   };
    // } else {
    //   data = {
    //     branch: 'test1',
    //     orderType: 'Return to vendor',
    //     goodsReceiptNo: 'test1',
    //     vendor: 'test1',
    //     approver: 'test1',
    //     status: 'Open',
    //     note: 'test1',
    //     data: [
    //       {
    //         no: 1,
    //         receiptQty: 1,
    //         returnQty: 1,
    //         reason: 'test reason 1',
    //         description: 'test description 1',
    //         materialCode: 'M200',
    //         materialDescription: 'MMMMMMMM',
    //         productUnit: 2,
    //         type: 'HHHH',
    //         group: 'DDD',
    //         common: {
    //           imgUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
    //         },
    //       },
    //       {
    //         no: 2,
    //         receiptQty: 1,
    //         returnQty: 1,
    //         reason: 'test reason 2',
    //         description: 'test description 2',
    //         materialCode: 'M200',
    //         materialDescription: 'MMMMMMMM',
    //         productUnit: 2,
    //         type: 'HHHH',
    //         group: 'DDD',
    //         common: {
    //           imgUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
    //         },
    //       },
    //     ],
    //   };
    // }
    // return Promise.resolve(data);
  }

  closeReturnRequest(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.closeReturnRequest.replace('@param', param),
      {},
      {},
      {}
    );
  }

  rejectReturnRequest(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.rejectReturnRequest,
      {},
      {},
      body
    );
  }

  approveReturnRequest(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.approveReturnRequest.replace('@param', param),
      {},
      {},
      {}
    );
  }

  confirmReturnRequest(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.confirmReturnRequest.replace('@param', param),
      {},
      {},
      {}
    );
  }

  getBranchByLoggedUser() {
    return apiService.makeRequest('post', API_PATHS.getBranch, {});
    // return Promise.resolve({
    //   data: [
    //     { value: 'TestCode', display: 'branch 1' },
    //     { value: 2, display: 'branch 2' },
    //     { value: 3, display: 'branch 3' },
    //     { value: 4, display: 'branch 4' },
    //     { value: 5, display: 'branch 5' },
    //   ],
    // });
  }

  deleteReturnRequest(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteReturnRequest.replace('@param', param),
      {},
      {},
      {}
    );
  }

  getVendorByBranch(param) {
    return apiService.makeRequest('post', API_PATHS.getVendor, param || {});
    // return Promise.resolve([
    //   { vendorCode: 1, vendorDisplay: 'vendor 1' },
    //   { vendorCode: 2, vendorDisplay: 'vendor 2' },
    //   { vendorCode: 3, vendorDisplay: 'vendor 3' },
    //   { vendorCode: 4, vendorDisplay: 'vendor 4' },
    //   { vendorCode: 5, vendorDisplay: 'vendor 5' },
    // ]);
  }

  getStatus(param) {
    return apiService.makeRequest('get', API_PATHS.getReturnRequestStatus);
  }

  getReason() {
    return apiService.makeRequest('get', API_PATHS.getReturnRequestReason);
  }

  getOrderType(param) {
    return apiService.makeRequest('get', API_PATHS.getReturnRequestOrderType);
  }

  getReturnRequestDetailsByGoodsReceiptNo(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getRRDetailsByGoodsReceiptNo.replace('@param', param)
    );
  }

  // Sample for testing common component,
  // will be replace with function in material-service later
  getMaterialList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getRRMaterialList,
      {},
      {},
      param
    );
    // const loadItemsSampleData = {
    //   totalItems: 2,
    //   data: [
    //     {
    //       returnRequestDetailId: 40,
    //       sku: '110000046',
    //       uom: '',
    //       quantity: 10.0,
    //       reasonCode: '1',
    //       itemType: 1,
    //       actualQty: 10.0,
    //       note: '',
    //       lineNumber: 2,
    //       batchNo: '',
    //       complaintNo: 'QWE',
    //       numerator: 11,
    //       denomirator: 1,
    //       itemInfo: {
    //         itemId: 10018,
    //         itemType: 1,
    //         sku: '110000046',
    //         itemName: 'ไข่ไก่ D',
    //         description: 'ไข่ไก่ D',
    //         baseUom: 'PAK',
    //         materialType: 'Z11',
    //         itemStatus: '1',
    //         volume: 15.0,
    //         weight: 0.0,
    //         barcodeReprintFlag: 0,
    //         materialGroup: '11010101',
    //         updateDate: '20201117134354',
    //         deleteFlag: 0,
    //         serviceDetailVOs: [],
    //         jobId: 1,
    //         displayEcomFlag: 0,
    //         ecomStorageFlag: 0,
    //         gstValue: 0.0,
    //         orderUnit: 'BAG',
    //         numerator: 11,
    //         denomirator: 1,
    //       },
    //     },
    //     {
    //       returnRequestDetailId: 41,
    //       sku: '110000045',
    //       uom: '',
    //       quantity: 10.0,
    //       reasonCode: '1',
    //       itemType: 1,
    //       actualQty: 10.0,
    //       note: '',
    //       lineNumber: 1,
    //       batchNo: '',
    //       complaintNo: 'ASD',
    //       numerator: 10,
    //       denomirator: 1,
    //       itemInfo: {
    //         itemId: 10014,
    //         itemType: 1,
    //         sku: '110000045',
    //         itemName: 'ไข่ไก่ C',
    //         description: 'ไข่ไก่ C',
    //         baseUom: 'PAK',
    //         materialType: 'Z11',
    //         itemStatus: '1',
    //         volume: 15.0,
    //         weight: 0.0,
    //         barcodeReprintFlag: 0,
    //         materialGroup: '11010101',
    //         updateDate: '20201117134354',
    //         deleteFlag: 0,
    //         serviceDetailVOs: [],
    //         jobId: 1,
    //         displayEcomFlag: 0,
    //         ecomStorageFlag: 0,
    //         gstValue: 0.0,
    //         orderUnit: 'BAG',
    //         numerator: 10,
    //         denomirator: 1,
    //       },
    //     },
    //   ],
    // };

    // const sampleDataForLoadItems = {
    //   totalItems: 7,
    //   data: [
    //     {
    //       itemId: 10014,
    //       itemType: 1,
    //       sku: '110000045',
    //       itemName: 'ไข่ไก่ C',
    //       description: 'ไข่ไก่ C',
    //       baseUom: 'PAK',
    //       materialType: 'Z11',
    //       itemStatus: '1',
    //       volume: 15.0,
    //       weight: 0.0,
    //       barcodeReprintFlag: 0,
    //       materialGroup: '11010101',
    //       updateDate: '20201117134354',
    //       deleteFlag: 0,
    //       serviceDetailVOs: [],
    //       jobId: 1,
    //       displayEcomFlag: 0,
    //       ecomStorageFlag: 0,
    //       gstValue: 0.0,
    //       orderUnit: 'BAG',
    //       numerator: 10,
    //       denomirator: 1,
    //     },
    //     {
    //       itemId: 10018,
    //       itemType: 1,
    //       sku: '110000046',
    //       itemName: 'ไข่ไก่ D',
    //       description: 'ไข่ไก่ D',
    //       baseUom: 'PAK',
    //       materialType: 'Z11',
    //       itemStatus: '1',
    //       volume: 15.0,
    //       weight: 0.0,
    //       barcodeReprintFlag: 0,
    //       materialGroup: '11010101',
    //       updateDate: '20201117134354',
    //       deleteFlag: 0,
    //       serviceDetailVOs: [],
    //       jobId: 1,
    //       displayEcomFlag: 0,
    //       ecomStorageFlag: 0,
    //       gstValue: 0.0,
    //       orderUnit: 'BAG',
    //       numerator: 11,
    //       denomirator: 1,
    //     },
    //   ],
    // };
    // // Sample data for loadItems
    // return param && param.orderType
    //   ? Promise.resolve(loadItemsSampleData)
    //   : Promise.resolve(sampleDataForLoadItems);
  }

  saveReturnRequest(body, action, savingType) {
    if (action === 'insert') {
      if (savingType === 'draft') {
        return apiService.makeRequest(
          'post',
          API_PATHS.saveDraftReturnRequest,
          {},
          {},
          body
        );
      } else {
        return apiService.makeRequest(
          'post',
          API_PATHS.submitReturnRequest,
          {},
          {},
          body
        );
      }
    } else {
      if (savingType === 'draft') {
        return apiService.makeRequest(
          'post',
          API_PATHS.updateReturnRequest,
          {},
          {},
          body
        );
      } else {
        return apiService.makeRequest(
          'post',
          API_PATHS.submitReturnRequest,
          {},
          {},
          body
        );
      }
    }
  }

  getHistoryData(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getReturnRequestHistoryData,
      {},
      {},
      params
    );
  }

  uploadReturnRequestImages(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.uploadReturnRequestImages,
      {},
      {},
      body
    );
  }
}

export default new ReturnRequestService();
