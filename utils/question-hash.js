const fs = require('fs');
const crypto = require('crypto');

exports.calculateHash = function calculateHash(name) {
  const filename = require.resolve(`../client/javascript/fixtures/${name}-questions.json`);
  const hash = crypto.createHash('sha1');
  hash.update(fs.readFileSync(filename));
  return hash.digest('hex');
};
