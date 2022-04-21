import userRoleService from '../services/user-role-service';

function getAllUserRole(body) {
  return userRoleService.getAllUserRole(body);
}

function deleteUserRole(body) {
  return userRoleService.deleteUserRole(body);
}

function updateUserRole(body) {
  return userRoleService.updateUserRole(body);
}

function getUserRoleFeatures(param) {
  return userRoleService.getUserRoleFeatures(param);
}

function addUserRole(body) {
  return userRoleService.addUserRole(body);
}

function getUserRole(body) {
  return userRoleService.getUserRole(body);
}

export {
  getAllUserRole,
  deleteUserRole,
  updateUserRole,
  getUserRoleFeatures,
  addUserRole,
  getUserRole,
};
