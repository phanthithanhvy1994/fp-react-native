import UserService from '../services/user-service';

// User for List page
export function getBranch(body) {
  return UserService.getBranch(body).then((res) => res);
}

export function getUserList(body) {
  return UserService.getUserList(body).then((res) => res);
}

export function getUserById(id) {
  return UserService.getUserById(id).then((res) => res);
}