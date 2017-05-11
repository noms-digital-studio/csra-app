import { SIGN_IN, SIGN_OUT } from '../constants/actions';

const defaultState = {
  signedIn: false,
  currentUser: {},
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case SIGN_IN:
      return { ...state, currentUser: { name: payload }, signedIn: true };
    case SIGN_OUT:
      return { ...state, currentUser: {}, signedIn: false };
    default:
      return state;
  }
};
