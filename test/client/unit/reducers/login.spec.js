import loginReducer from '../../../../client/javascript/reducers/login';

describe('#loginReducer', () => {
  const defaultState = {
    signedIn: false,
    currentUser: {},
  };

  it('returns a default state', () => {
    expect(loginReducer(undefined, 'UNKNOWN_ACTION')).to.eql(defaultState);
  });

  it('return a logged in state with a user', () => {
    const action = { type: 'SIGN_IN', payload: 'Foo Bar' };
    const expectedState = {
      ...defaultState,
      signedIn: true,
      currentUser: {
        name: 'Foo Bar',
      },
    };
    expect(loginReducer(undefined, action)).to.eql(expectedState);
  });

  it('return a logged out state', () => {
    const action = { type: 'SIGN_OUT' };
    const expectedState = {
      signedIn: false,
      currentUser: {},
    };
    expect(loginReducer(undefined, action)).to.eql(expectedState);
  });
});
