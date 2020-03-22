const database = require('./lib/database');
const { fireEvent } = require('./lib/websockets');
const sessionSerializer = require('./lib/sessionSerializer');

exports.handler = async function(event, _context) {
  const { sessionCode, userId, userName, avatar } = event.queryStringParameters;
  const emoji = avatar || '👨🏾‍💻';

  if (!sessionCode) return { statusCode: 404, body: 'Could not find sessionCode' };
  if (!userName) return { statusCode: 422, body: 'userName must be provided' };

  let session = await database.findSession(sessionCode);

  if (!session) {
    // Doesn't exist, create it and add me
    session = await database.createSession(sessionCode, userName, userId, emoji);
  } else if (session.users[userId]) {
    // I'm already in there, return but don't add me
  } else if (session.targetTime) {
    // Session has started, return but don't add me
  } else {
    // Exists and hasn't kicked off, add me
    users = { [userId]: { name: userName, emoji }};
    session = await database.updateSession({ sessionCode, users });
  }

  await fireEvent(sessionCode, 'update-state', sessionSerializer(session));

  return {
    statusCode: 200,
    body: JSON.stringify(sessionSerializer(session)),
  };
}
