module.exports = function(session) {
  const { sessionId, sessionCode, targetTime } = session;

  const users = Object.entries(session.users).map(([userId, userDetails]) => ({ ...userDetails, userId }));

  return {
    sessionId,
    sessionCode,
    targetTime,
    users,
  }
}
