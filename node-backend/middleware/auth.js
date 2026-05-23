const jwt = require('jsonwebtoken');

/**
 * JWT Verification Middleware using the real JWT Secret Key
 */
function verifyToken(req, res, next) {
  let token = req.cookies ? req.cookies.sh_token : null;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Access Denied: No session token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session' });
  }
}

/**
 * Middleware: Verify that the authenticated user is an administrator
 */
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access Denied: Admin authorization required' });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
