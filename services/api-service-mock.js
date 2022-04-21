import fakeBackend from './fake-back-end';

class ApiServiceMock {
  async get(path = '', params = {}, headers = {}) {
    return fakeBackend.get(path, params, headers);
  }

  async post(path = '', body = {}, headers = {}) {
    return fakeBackend.post(path, body, headers);
  }

  async put(path = '', body = {}, headers = {}) {
    return fakeBackend.put(path, body, headers);
  }
}

const apiServiceMock = new ApiServiceMock();
export default apiServiceMock;
