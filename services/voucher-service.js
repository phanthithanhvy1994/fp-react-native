import apiService from './api-service';
import { API_PATHS } from './service.config';

class VoucherService {
  //detail voucher
  getVoucher(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getVoucherDetail.replace('@id', id)
    );
  }

  //confirm Voucher
  confirmVoucher(id) {
    return apiService.makeRequest(
      'get',
      API_PATHS.confirmVoucher.replace('@id', id)
    );
  }

  //get data detail
  getVoucherList(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getVoucherList,
      null,
      null,
      params
    );
  }

  //voucher search
  getVoucherDetailGrid(params) {
    return apiService.makeRequest(
      'post',
      API_PATHS.getVoucherDetailGrid,
      null,
      null,
      params
    );
  }

  getVoucherName = () => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getVoucherName,
      null,
      null,
      {}
    );
  };

  getVoucherChannel() {
    return apiService.makeRequest('get', API_PATHS.getVoucherChannel);
  }

  getVoucherStatus() {
    return apiService.makeRequest('get', API_PATHS.getVoucherStatus);
  }

  getVoucherPromotion() {
    return apiService.makeRequest('get', API_PATHS.getVoucherPromotion);
  }

  exportVoucherExternal = params => {
    return apiService.makeRequest(
      'post',
      API_PATHS.exportVoucher,
      {},
      {},
      params
    );
  };

  importVoucher = params => {
    return apiService.makeRequest(
      'post',
      API_PATHS.importVoucher,
      {},
      {},
      params
    );
  };

  getVoucherMatDesc = () => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getValueMatDesc,
      null,
      null,
      {}
    );
  };
  editVoucher = params => {
    return apiService.makeRequest(
      'post',
      API_PATHS.editVoucher,
      {},
      {},
      params
    );
  };

  getSaleOrder = params => {
    return apiService.makeRequest('get', API_PATHS.getSaleOrder, params);
    // return Promise.resolve({
    //   status: 200,
    //   data: {
    //     saleReceiptId: 8,
    //     receiptNumber: 2010000047,
    //     saleReceiptType: 0,
    //     soldTo: '0010000833',
    //     shipTo: '0010000833',
    //     salesOrg: 1001,
    //     distChannel: 10,
    //     updateDate: '20210130161625',
    //     deleteFlag: 0,
    //     salesOffice: 1102,
    //     soDoStatus: 'C',
    //     saleReceiptDetailRestVOS: [
    //       {
    //         saleReceiptDetailId: 12,
    //         itemType: 0,
    //         sku: 460000019,
    //         description: 'CVC - Physical Voucher 100',
    //         quantity: 5.0000,
    //         lineItem: '000010',
    //         priceI: 93,
    //         discountPriceI: 0,
    //         mdrPriceI: 0,
    //         comnPriceI: 0,
    //         typeName: 'P-VOUCHER',
    //         existed: 1,
    //         scannedQuantity: 1,
    //         allowDelete: 1,
    //         validFrom: '20210302000000',
    //         validTo: '20210302000000',
    //       },
    //       {
    //         saleReceiptDetailId: 13,
    //         itemType: 0,
    //         sku: 460000020,
    //         description: 'CVC - Physical Voucher 500',
    //         quantity: 5.0000,
    //         priceI: 467,
    //         discountPriceI: 0,
    //         mdrPriceI: 0,
    //         comnPriceI: 0,
    //         typeName: 'P-VOUCHER',
    //         existed: 1,
    //         scannedQuantity: 0,
    //         allowDelete: 1,
    //         validFrom: '20210302000000',
    //         validTo: '20210302000000',
    //       }
    //     ]
    //   }
    // });
  };

  getSOInformation = params => {
    // return apiService.makeRequest('post', API_PATHS.getSOInformation, {}, {}, params);
    // For testing in case sale Order No is not exist
    // if (params.saleOrderNo === '1234') {
    //   return Promise.resolve({
    //     status: 200,
    //     data: [],
    //   });
    // }

    const sampleData = {
      soldTo: '81005 - ABC Company',
      shipTo: '82001 - DEF Company',
      customerPONo: 'CUS001',
      voucherStartDate: '20201109000000',
      voucherEndDate: '20201110000000',
      statusName: 'in-completed',
      status: '2',
      type: 'C',
      saleOrderVODetails: [
        {
          materialNo: '4900000001',
          materialDescription: 'HASDHAS DADHAHSDADU QU WUEQWU E QWEWEIQW',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 123,
          scannedQuantity: 10,
          voucherType: 1,
          voucherTypeName: '100 Baht',
        },
        {
          materialNo: '4900000002',
          materialDescription: 'description13',
          typeName: 'P-Voucher',
          promotionName: 'demo',
          orderQuantity: 10,
          scannedQuantity: 0,
          voucherType: 1,
          voucherTypeName: '100 Baht',
        },
        {
          materialNo: '4900000003',
          materialDescription: 'HASDHAS 123123 QU 523 FRW122E QWE123EIQW',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 5,
          scannedQuantity: 1,
        },
        {
          materialNo: '4900000004',
          materialDescription: 'W WWW WWWWWWWW WWWWWWWWW WWWWWWW WWWWW W',
          typeName: 'P-Voucher',
          promotionName: 'demo',
          orderQuantity: 5,
          scannedQuantity: 0,
          voucherType: 1,
          voucherTypeName: '100 Baht',
        },
        {
          materialNo: '4900000005',
          materialDescription: 'description1',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 123,
          scannedQuantity: 10,
        },
        {
          materialNo: '4900000006',
          materialDescription: 'description1',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 123,
          scannedQuantity: 10,
        },
        {
          materialNo: '4900000007',
          materialDescription: 'description1',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 123,
          scannedQuantity: 10,
        },
        {
          materialNo: '4900000008',
          materialDescription: 'description1',
          typeName: 'E-Voucher',
          promotionName: 'demo',
          orderQuantity: 123,
          scannedQuantity: 10,
        },
      ],
    };

    // sample data for case SO is type of A and B
    const aAndBSOData = {
      ...sampleData,
      voucherStartDate: null,
      voucherEndDate: null,
      type: 'A'
    };
    
    return Promise.resolve({
      status: 200,
      data: params.saleOrderNo === '123456' ? aAndBSOData : sampleData
    });
  };

  getValuePackDetails = (id, params) => {
    return apiService.makeRequest(
      'get',
      API_PATHS.getPackValueByID.replace('@id', id),
      params
    );
  };

  getScanVoucherData = params => {
    return apiService.makeRequest('post', API_PATHS.getScanVoucherData, {}, {}, params);
    // For testing
    // const bookletVouchers = [
    //   {
    //     serialNo: '2323',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '56565',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '767676',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '80000',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '121212',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '900018',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '900019',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '900020',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '900021',
    //     validFrom: '',
    //     validTo: '',
    //   },
    //   {
    //     serialNo: '900022',
    //     validFrom: '',
    //     validTo: '',
    //   },
    // ];

    // const vouchers = {
    //   serialNo: params.code,
    //   validFrom: '20201112000000',
    //   validTo: '20221112010101',
    // };
    // return params.code === '123'
    //   ? Promise.resolve({
    //     status: 200,
    //     errorMessage: 'Voucher is already scan',
    //   })
    //   : Promise.resolve({
    //     status: 200,
    //     data:
    //       params.code.toString() === '12345' ? bookletVouchers : vouchers,
    //   });
  };

  getEVoucherTypeSNPrefix = () => {
    return apiService.makeRequest('get', API_PATHS.getOptions.getEVoucherTypeSNPrefix);
  };
  getPVoucherTypeSNPrefix = () => {
    return apiService.makeRequest('get', API_PATHS.getOptions.getPVoucherTypeSNPrefix);
  };

  getSerialNo = () => {
    return apiService.makeRequest('get', API_PATHS.getOptions.getSerialNo);
  };

  getIssueBy = () => {
    return apiService.makeRequest('get', API_PATHS.getOptions.getIssueBy);
  };

  getCompanyCode = () => {
    return apiService.makeRequest('get', API_PATHS.getCompanyCode);
  };

  getChannel = () => {
    return apiService.makeRequest('get', API_PATHS.getOptions.getChannel);
  };

  getVoucherValueType = (body) => {
    return apiService.makeRequest('post', API_PATHS.getValueMatDesc, {}, {}, body);
  }
  
  createVoucher = (body) => {
    return apiService.makeRequest('post', API_PATHS.createVoucher, {}, {}, body);
  }
  updateVoucher = (body) => {
    return apiService.makeRequest('post', API_PATHS.updateVoucher, {}, {}, body);
  }

  getPackValueList = params => {
    return apiService.makeRequest(
      'post',
      API_PATHS.getPackValueList,
      {},
      {},
      params
    );
  };

  getValuePackTypeStatus = () => {
    return apiService.makeRequest('get', API_PATHS.getValuePackTypeStatus);
  };

  deletePackValue(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.deletePackValueByID,
      {},
      {},
      body
    );
  }

  getSavedScannedVoucher = (params) => {
    return apiService.makeRequest('get', API_PATHS.getSavedScannedVoucher, params);
  }

  saveVoucherActivation = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.saveVoucherActivation,
      {},
      {},
      params
    );
  }

  deleteAllScannedVoucher = (params) => {
    return apiService.makeRequest(
      'post',
      API_PATHS.deleteAllScannedVoucher,
      {},
      {},
      params
    );
    // return Promise.resolve({
    //   status: '200'
    // });
  }
}

export default new VoucherService();
