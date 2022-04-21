const mockData = require('../data/data.json');

class FakeBackend {
  get(path = '', params = {}, headers = {}) {
    console.log(
      `Requesting to: ${path}, with params: ${JSON.stringify(
        params
      )}, params: ${headers}`
    );
    // Task
    if (path.startsWith('/task')) {
      if (path.startsWith('/task/search')) {
        return this.asPromise(mockData['pendingTasks1']);
      }
    }

    return this.asPromise('TODO');
  }

  post(path = '', body = {}, params = {}) {
    console.log(
      `Submitting to: ${path}, with body: ${JSON.stringify(
        body
      )}, params: ${params}`
    );
    return this.asPromise('TODO');
  }

  put(path = '', body = {}, params = {}) {
    console.log(
      `Putting to: ${path}, with body: ${JSON.stringify(
        body
      )}, params: ${params}`
    );
    return this.asPromise('TODO');
  }

  asPromise(data, error) {
    return new Promise((resolve, reject) => {
      if (data) {
        setTimeout(() => {
          resolve({
            data,
          });
        }, 1000);
      } else if (error) {
        reject(new Error('Something went wrong'));
      }
    });
  }
}

const fakeBackend = new FakeBackend();
export default fakeBackend;
