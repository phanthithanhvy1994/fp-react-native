import includes from 'lodash/includes';
import get from 'lodash/get';
import { STATUS } from '../services/service.config';
import history from '../util/history';

export function handleError(response) {
  const error = get(response, 'data.message', 'Error system!');
  history.push('/error');
  return Promise.reject(error);
}

export function handleResponse(response) {
  const status = get(response, 'data.status', 500).toString();
  return new Promise((resolve, reject) => {
    if (status !== STATUS.success && status !== STATUS.badRequest) {
      if (includes([STATUS.accessDenied, STATUS.unauthorizedAccess], status)) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        // authenticationService.logout();
      }
      reject(response);
    } else {
      resolve(response.data);
    }
  });
}

export function handleBeforeSendRequest(request) {
  return request;
}
