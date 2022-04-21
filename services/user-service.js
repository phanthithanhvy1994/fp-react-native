import apiService from './api-service';
import { API_PATHS } from './service.config';
import { fakeApiUserRole } from '../util/form-util';

class UserService {
  getUser(param) {
    return apiService.makeRequest('get', API_PATHS.getUser, param);
  }

  getUserByCode(param) {
    return apiService.makeRequest('get', API_PATHS.getUserByCode, param);
  }

  getUserRoleList(param) {
    return Promise.resolve(fakeApiUserRole(50, param.page, param.itemsPerPage));
    // return apiService.makeRequest('get', PATHS.userByCode, param);
  }

  getBranch(param) {
    return apiService.makeRequest('post', API_PATHS.getBranch, {},{},param);
  }

  getUserList(body) {
    return Promise.resolve({
      status: '200',
      data: [
        {
          statusName: 'Good',
          userCode: 1,
          username: 'Project Name',
          firstName: 'Alo',
          lastName: 'hi',
          departmentName: 'IT',
          positionName: 'HR',
          divisionName: 'Accounting',
          telephone: '090293453',
          email: 'abc@hitachivantara.com'
        },
        {
          statusName: 'Excellent',
          userCode: 2,
          username: 'Drink passion',
          firstName: 'Alo',
          lastName: 'hi',
          departmentName: 'Head Office',
          positionName: 'HR',
          divisionName: 'Accounting',
          telephone: '090293453',
          email: 'abc@hitachivantara.com'
        },
        {
          statusName: 'Bad',
          userCode: 1,
          username: 'Water passion',
          firstName: 'Alo',
          lastName: 'hi',
          departmentName: 'Engineer',
          positionName: 'Finance',
          divisionName: 'Accounting',
          telephone: '090293453',
          email: 'abc@hitachivantara.com'
        },
      ],
      totalRecord: 26
    });
  }

  getUserById(id) {
    return Promise.resolve({
      status: '200',
      data: {
        userId: 1,
        userCode: '11111',
        firstName: 'Vantara',
        lastName: 'Hitachi',
        email: 'abc.def@hitachivantara.com',
        telephone: '1234567890',
        branchCode: '1000',
        branchName: 'Kentucky',
        address: '52 Phi Long Street',
        department: '1010',
        departmentName: 'IT',
        position: 'Staff',
        division: 'HR',
        employeeID: '12345',
        username: 'foodLover',
        role: 'B001',
        accountStatus: '1000',
        assignedRole: 'user'
      }
    });
  }
}
export default new UserService();
