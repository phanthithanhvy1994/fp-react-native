import apiService from './api-service';
import { API_PATHS } from './service.config';

class CouponService {
  getCouponList(param) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getCouponList,
      {},
      {},
      param
    );
  }
  getCouponExport = () => {
    return Promise.resolve({
      data: [
        {
          name: 'Coupon Name',
          no: 'Coupon Serial No',
          type: 'Type',
          value_type: 'Coupon Value Type',
          status: 'Status',
          form: 'Valid From',
          to: 'Valid To',
          sale: 'Sale Order No',
          booklet: 'Booklet Code',
          channel: 'Channel',
          market: 'Market Place',
        },
      ],
    });
  };
  getCouponName = () => {
    return apiService.makeRequest('post', API_PATHS.getCouponName, {});
  };
  getCouponType = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponType);
  };
  getCouponTypeList = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponTypeList);
  };
  getCouponListValueType = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponListValueType, {});
  };
  getCompanyCode = () => {
    return apiService.makeRequest('get', API_PATHS.getCompanyCode);
  };
  getCouponTypeSNPrefix  = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponTypeSNPrefix);
  };
  getSerialNo = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponSerialNo);
  };
  getIssueType = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponIssueType);
  };
  getCouponPromotion = () => {
    return apiService.makeRequest('post', API_PATHS.getCouponPromotion, {});
  };
  getCouponValueType = (body) => {
    return apiService.makeRequest('post', API_PATHS.getValueMatDesc, {}, {}, body);
  };
  saveCoupon = (body) => {
    return apiService.makeRequest('post', API_PATHS.saveCoupon, {}, {}, body);
  }

  //confirm Coupon
  confirmCoupon(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.confirmCoupon.replace('@id', id)
    );
  }
  //edit status Coupon
  editStatusCoupon(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.editStatusCoupon,
      {},
      {},
      body
    );
  }

  getCouponStatus = () => {
    return apiService.makeRequest('get', API_PATHS.getCouponStatus);
  };
  getCoupon(params) {
    // return apiService.makeRequest('get', API_PATHS.getCoupon, params);
    return Promise.resolve({
      status: 200,
      data: {
        name: 'Opening Coupon',
        typeName: 'Physical Coupon',
        serialCodeType: 'Running serial code',
        couponValueType: 'Percentage',
        couponValue: '20%',
        snPrefix: '201011111',
        serialNoDigit: '11',
        couponSerialNo: 'N201XXXXXXXX',
        promotionCode: 'Abc',
        validFrom: '31/10/2020',
        validTo: '31/12/2020',
        note: 'Test',
        totalCouponQty: '50',
        bookletQty: '2',
        qtyPerBooklet: '50',
        totalActive: '5',
        totalReadyToSave: '10',
        totalUsed: '50',
        totalExpired: '5',
        totalInActive: '0',
        totalHold: '0',
        totalReserveForSales: '0',
        couponItemsList: [
          {
            serialNo: '204001000001',
            couponValue: '100 Baht',
            statusName: 'Active',
            status: 1,
            validFrom: '20201119000000',
            validTo: '20201130000000',
            saleOrderNo: '10001',
            bookletCode: 'B01',
            branchName: 'demo',
            branchCode: 1,
            channelName: 'Channel 1',
            valuePackNo: '20001',
            transactionDate: '20201119000000',
          },
          {
            serialNo: '204001000002',
            couponValue: '120 Baht',
            statusName: 'Active',
            status: 1,
            validFrom: '20201119000000',
            validTo: '20201130000000',
            saleOrderNo: '10001',
            bookletCode: 'B01',
            branchName: 'demo',
            branchCode: 1,
            channelName: 'Channel 2',
            valuePackNo: '20002',
            transactionDate: '20201119000000',
          },
        ],
        historyData: [
          {
            time: '20201119000000',
            userName: 'user a',
            note: 'demo',
          },
        ],
      },
    });
  };

  /**
   * Get List of saved scan coupon
   * @param {Object} params 
   */
  getCouponScanInformation(params) {
    return apiService.makeRequest('post', API_PATHS.getCouponScanInformation, {}, {}, params);
  };

  scanningCouponData = (params) => {
    return apiService.makeRequest('post', API_PATHS.scanningCouponData, {}, {}, params);
  }

  updateScanCouponList = (params) => {
    return apiService.makeRequest('post', API_PATHS.updateScanCouponList, {}, {}, params);
  };


  importCoupon(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.importCoupon,
      {},
      {},
      params
    );
  }

  exportCoupon(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.exportCoupon,
      {},
      {},
      params
    );
  }

  // Service Detail Page
  getCouponDetailsById(param) {
    return apiService.makeRequest('get', API_PATHS.getCouponDetailsById, param);
  }

  deleteCoupon(param) {
    return apiService.makeRequest('post', API_PATHS.deleteCoupon, {}, {}, param);
  }

  getCouponDetailGrid(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getCouponDetailGrid,
      null,
      null,
      params
    );
  }
}



export default new CouponService();
