/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const request = require('superagent');


const mojDevToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJpYXQiOjE1MDYwNzgwNDksImV4cCI6MTUzNzU3MDgwMCwiY2xpZW50IjoiQ2VsbCBTaGFyaW5nIFJpc2sgQXNzZXNzbWVudCIsImtleSI6Ik1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRXI1K09ZTURvZUZCdDBnNlNrV2tUeG94WVZHREMyOUE3K05BMk5XUC9YK0h4MGVrNEFPemEwRFkxK1YrTTBmV1ROdUQyckwwTVUyRkNlZWVyWTNBWWxRPT0iLCJhY2Nlc3MiOlsiLioiXX0.bXKK-JBrAXIgtuBT8L80YS6MtEv9QU3Bv13pcIj0hG_L3HsASfoLQH6HkXeuhvIhoKylisaY4-DJrdzAtwN4Nw';
const base64PrivateKey = 'LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IY0NBUUVFSUE3ODVWYjQ2dkxvSVo1MmNHRGZBWm5mckFJc2FlWTVSSzlmSTBRSGNXS0VvQW9HQ0NxR1NNNDkKQXdFSG9VUURRZ0FFcjUrT1lNRG9lRkJ0MGc2U2tXa1R4b3hZVkdEQzI5QTcrTkEyTldQL1grSHgwZWs0QU96YQowRFkxK1YrTTBmV1ROdUQyckwwTVUyRkNlZWVyWTNBWWxRPT0KLS0tLS1FTkQgRUMgUFJJVkFURSBLRVktLS0tLQo=';

const privateKey = Buffer.from(base64PrivateKey, 'base64');


function generateToken() {
  // const mojDevToken = <MoJ issued JWT Token>;
  const milliseconds = Math.round((new Date()).getTime() / 1000);

  const payload = {
    iat: milliseconds,
    token: mojDevToken,
  };

  // const privateKey = <Private key used to generate MoJ Token>;
  const cert = Buffer.from(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}


const makeRequest = config => request
  .post('https://noms-api-dev.dsd.io/elite2api-stage/users/login')
  .set('Authorization', `Bearer ${generateToken()}`)
  .send({ username: 'NREDSHAW', password: 'password123456' })
  .then((result, error) => {
    console.log('============================================');
    console.log('POST -> https://noms-api-dev.dsd.io/elite2api-stage/users/login');
    console.log(JSON.stringify(result.body, null, 2));
    console.log('============================================');
    console.log(' ');

    if (error) {
      console.log('Error: ', error);
    }

    return request.get(config.url)
      .set('Authorization', `Bearer ${generateToken()}`)
      .set('Elite-Authorization', `${result.body.token}`)
    // .responseType('blob')
      .then((result2, error2) => {
        console.log('============================================');
        console.log('GET -> ', config.url);
        // console.log(result2.body);

        // const buffer = new Buffer(result2.body);
        // const bufferBase64 = buffer.toString('base64');

        // console.log(bufferBase64);

        console.log(JSON.stringify(result2.body, null, 2));
        console.log('============================================');
        console.log(' ');

        if (error) {
          console.log('Error: ', error2);
        }
      });
  });


console.log('Making request...');
// makeRequest({ url: 'https://noms-api-dev.dsd.io/elite2api-stage/users/me' });
// makeRequest({ url: "https://noms-api-dev.dsd.io/elite2api-stage/bookings?query=offenderNo:like:'A1464AE',firstName:like:'A1464AE'" });
// makeRequest({ url: 'https://noms-api-dev.dsd.io/elite2api-stage/bookings/52022' });
makeRequest({ url: 'https://noms-api-dev.dsd.io/elite2api-stage/search-offenders/_/A1421AE' });

// makeRequest({ url: 'https://noms-api-dev.dsd.io/elite2api-stage/images/4249/data' });


console.log('Done...');
