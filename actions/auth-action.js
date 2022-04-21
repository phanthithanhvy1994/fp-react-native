import authService from '../services/auth-service';

export function getUserInfo() {
  return authService.getUserInfo();
}
export function signOut() {
  return authService.logout();
}
