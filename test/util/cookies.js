import cookie from 'cookie';

const parsePassportSessionCookie = (result) => {
  const cookies = cookie.parse(result.headers['set-cookie'][0]);
  return atob(cookies['express:sess']);
};

export default parsePassportSessionCookie;
