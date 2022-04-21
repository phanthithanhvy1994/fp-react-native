import apiService from './api-service';
import { API_PATHS } from './service.config';


class PurchaseOrderService {
  getMaterialType(param) {
    return apiService.makeRequest(
      'get',
      API_PATHS.getMaterialType,
      param || {}
    );
  }

  getMaterialGroup(param) {
    // return apiService.makeRequest(
    //   'post',
    //   API_PATHS.getMaterialGroup,
    //   param || {}
    // );
    return Promise.resolve({
      'status': '200',
      'data': [
        {
          'id': 1,
          'display': 'RM Expense',
          'value': 1,
          'code': 'RM_EXPENSE',
        },
        {
          'id': 2,
          'display': 'Travel Fee',
          'value': 2,
          'code': 'TRAVEL_FEE',
        },
        {
          'id': 3,
          'display': 'Security',
          'value': 3,
          'code': 'SECURITY',
        },
        {
          'id': 4,
          'display': 'Delivery Fee',
          'value': 4,
          'code': 'DELIVERY_FEE',
        },
        {
          'id': 5,
          'display': 'RM Emergency',
          'value': 5,
          'code': 'RM_EMERGENCY',
        }
      ]
    });
  }

  // Sample for testing common component,
  // will be replace with function in material-service later
  getMaterialList(param) {
    // return apiService.makeRequest(
    //   'post',
    //   API_PATHS.getRRMaterialList,
    //   {},
    //   {},
    //   param
    // );
    return Promise.resolve({
      'status': '200',
      'data': [
        {
          description: 'item 1',
          entity: 'po_petty_cash',
          id: 84,
          materialGroup: 'RM_EXPENSE',
          materialGroupName: 'RM Expense',
          materialType: 'Z11',
          materialTypeName: 'Raw Materials',
          sku: '110458164'
        },
        {
          description: 'item 2',
          entity: 'po_petty_cash',
          id: 85,
          materialGroup: 'TRAVEL_FEE',
          materialGroupName: 'Travel Fee',
          materialType: 'Z11',  
          materialTypeName: 'Raw Materials',
          sku: '110000854'
        },
        {
          description: 'item 3',
          entity: 'po_petty_cash',
          id: 86,
          materialGroup: 'SECURITY',
          materialGroupName: 'Security',
          materialType: 'Z11',
          materialTypeName: 'Raw Materials',
          sku: '110120164'
        },
        {
          description: 'item 4',
          entity: 'po_petty_cash',
          id: 87,
          materialGroup: 'DELIVERY_FEE',
          materialGroupName: 'Delivery Fee',
          materialType: 'Z11',    
          materialTypeName: 'Raw Materials',
          sku: '112000164'
        },
        {
          description: 'item 5',
          entity: 'po_petty_cash',
          id: 88,
          materialGroup: 'RM_EMERGENCY',
          materialGroupName: 'RM Emergency',
          materialType: 'Z11',    
          materialTypeName: 'Raw Materials',
          sku: '11000024'
        },
      ],
      totalRecord: 5
    });
  }

  uploadImages(body) {
    return apiService.makeRequest(
      'post',
      API_PATHS.uploadReturnRequestImages,
      {},
      {},
      body
    );
  };

  savePoPettyCash(body, action, savingType){
    return Promise.resolve({
      'status': '200',
      'data': []
    });  
  }

  getVendor(param) {
    return apiService.makeRequest('post', API_PATHS.getVendor, param || {});
  }

  rejectPettyCash(body){
    // return apiService.makeRequest('post', API_PATHS.rejectPettyCash, {},{}, body); 
    return Promise.resolve({
      'status': '200',
      'data': []
    });   
  }

  closePettyCash(body){
    // return apiService.makeRequest('post', API_PATHS.closePettyCash, {},{}, body); 
    return Promise.resolve({
      'status': '200',
      'data': []
    });  
  }

  getPettyCashList(body){
    return Promise.resolve({
      'status': '200',
      'data': [
        {
          pettyCashId: 1,
          status: 'Approved',
          type: 1,
          amount: 200000,
          venderName: '',
          submittedDate: '01.03.2021',
          createdBy:'admin',
          approvedBy: 'admin',
          note: ''
        },
        {
          pettyCashId: 2,
          status: 'Draft',
          type: 0,
          amount: 100000,
          venderName: 'Dai Dau',
          submittedDate: '01.03.2021',
          createdBy:'A',
          approvedBy: 'B',
          note: 'Buy somethings'
        }
      ]
    });
  }

  deletePettyCashById(body){
    // return apiService.makeRequest('post', API_PATHS.deletePettyCash, {},{}, body); 
    return Promise.resolve({
      'status': '200',
      'data': []
    }); 
  }

}

export default new PurchaseOrderService();