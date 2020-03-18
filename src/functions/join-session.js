const database = require('./lib/database');
const { fireEvent } = require('./lib/websockets');

exports.handler = async function(event, _context) {
  const { sessionCode, userName } = event.queryStringParameters;

  if (!sessionCode) return { statusCode: 404, body: 'Could not find sessionCode' };
  if (!userName) return { statusCode: 422, body: 'userName must be provided' };

  let session = await database.findSession(sessionCode);

  if (!session) {
    // Doesn't exist, create it and add me
    session = await database.createSession(sessionCode, userName);
  } else if (session.users.find(u => u.name === userName)) {
    // I'm already in there, return but don't add me
  } else if (session.targetTime) {
    // Session has started, return but don't add me
  } else {
    // Exists and hasn't kicked off, add me
    newUsers = [...session.users, { name: userName, emoji: '👨🏾‍💻' }];
    session = await database.updateSession({ sessionCode, users: newUsers });
  }

  fireEvent(sessionCode, 'update-state', session);

  return {
    statusCode: 200,
    body: JSON.stringify(session),
  };
}
