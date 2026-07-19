const getSessionId = (req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    res.setHeader('x-session-id', sessionId);
  }
  req.sessionId = sessionId;
  next();
};
module.exports = getSessionId;
