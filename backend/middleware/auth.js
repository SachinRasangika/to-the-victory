const jwt = require('jsonwebtoken');

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY || 'dev_secret_key';
  return secret;
}

module.exports.signToken = function (payload, options = {}) {
  const secret = getSecret();
  const defaultOpts = { expiresIn: '7d' };
  return jwt.sign(payload, secret, { ...defaultOpts, ...options });
};

module.exports.verifyToken = function (token) {
  try {
    return jwt.verify(token, getSecret());
  } catch (err) {
    return null;
  }
};
