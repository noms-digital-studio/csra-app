const { extractAuthoritiesFrom } = require('../../../server/jwtUtils');

describe('jwt utils', () => {
  it('extracts authorities from jwt token correctly', () => {
    const payload = btoa(JSON.stringify(
      {
        sub: 'AUSER',
        deviceFingerprintHashCode: -656086319,
        allowRefreshToken: false,
        userPrincipal: {
          username: 'AUSER',
          authorities: [{ authority: 'ROLE_A' }, { authority: 'ROLE_B' }],
        },
        iss: 'http://www.foo.net',
        iat: 1508507284,
        exp: 1508509084,
      }));

    const algorithm = btoa(JSON.stringify({ alg: 'HS512' }));
    const aToken = `Bearer ${algorithm}.${payload}.zzz`;

    expect(extractAuthoritiesFrom(aToken)).to.eql([
      { authority: 'ROLE_A' },
      { authority: 'ROLE_B' },
    ]);
  });
});
