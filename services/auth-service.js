import { BehaviorSubject } from 'rxjs';
// import get from 'lodash/get';
import apiService from './api-service';

// const parseJwt = token => {
//   if (!token) {
//     return null;
//   }
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//       .join('')
//   );

//   return JSON.parse(jsonPayload);
// };

class AuthService {
  currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user'))
  );

  login(user) {
    return apiService.post('/authenticate', user);
  }

  changePassword(payload) {
    return apiService.put('/auth/password', payload);
  }

  forgotPassword(username) {
    return apiService.post('/auth/forget', { username });
  }

  forgotPasswordSubmit(username, verificationCode, newPassword) {
    const payload = {
      username,
      verificationCode,
      newPassword,
    };
    return apiService.post('/auth/forget', payload);
  }

  getUserInfo() {
    // const idToken = get(this.currentUserSubject, 'value.token', '');
    // if (!idToken) return null;
    // const payload = parseJwt(idToken);
    // const userName = payload['cognito:username'];
    // const role = payload['custom:role'];
    // const familyName = payload['family_name'];
    // const givenName = payload['given_name'];
    // const { sub, exp, email } = payload;
    // const country = payload['custom:country'];
    // const accessControl = JSON.parse(
    //   localStorage.getItem('accessControl') || null
    // );
    // return {
    //   userName,
    //   role,
    //   familyName,
    //   givenName,
    //   sub,
    //   country,
    //   accessControl,
    //   email,
    //   exp,
    // };

    // FIXME: remove below code after testing
    return {
      userName: 'admin',
      role: 'admin',
      email: 'admin@admin',
    };
  }

  getAccessToken() {
    return this.currentUserSubject.value.accessToken;
  }

  getRefreshToken() {
    return this.currentUserSubject.value.refreshToken;
  }

  getIdToken() {
    return this.currentUserSubject.value.idToken;
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  refreshToken() {
    const username = this.getUserInfo().email;
    const refreshToken = this.getRefreshToken();
    const payload = {
      username,
      refreshToken,
    };
    return apiService.post('/auth/token', payload);
  }
}
export default new AuthService();
