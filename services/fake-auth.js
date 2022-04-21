class FakeAuth {
  signIn(userName, password) {
    console.log(`Fake signIn: ${userName}/${password}`);
  }

  userAttributes(user) {
    console.log(`Fake userAttributes: ${user}`);
  }

  completeNewPassword(user, password) {
    console.log(`Fake completeNewPassword: ${user}/${password}`);
  }

  signUp(signUpInfo) {
    console.log(`Fake signUp: ${signUpInfo}`);
  }
}

export default new FakeAuth();
