const jwt = require('jsonwebtoken');

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY || '';
  if (!secret) {
    console.warn('WARNING: JWT secret is not set. Set JWT_SECRET in your environment for security.');
    return 'insecure_dev_secret_change_me';
  }
  return secret;
}

module.exports.requireAuth = function (req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = jwt.verify(token, getSecret());
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports.signToken = function (payload, options = {}) {
  const secret = getSecret();
  const defaultOpts = { expiresIn: '7d' };
  return jwt.sign(payload, secret, { ...defaultOpts, ...options });
};
