const database = require('./lib/database');
const { fireEvent } = require('./lib/websockets');
const sessionSerializer = require('./lib/sessionSerializer');
const differenceInSeconds = require('date-fns/differenceInSeconds');

exports.handler = async function(event, _context) {
  const { sessionCode, userId } = event.queryStringParameters;
  const { targetTime, users } = await database.findSession(sessionCode);
  const user = users[userId];

  if (!sessionCode) return { statusCode: 404 };
  if (!user) return { statusCode: 422 }; // user doesn't exist
  if (!targetTime) return { statusCode: 422 }; // hasn't started
  if (targetTime && differenceInSeconds(new Date(), Date.parse(targetTime)) >= 5) return { statusCode: 422 }; // finished

  const clapTime = (new Date).toISOString();

  const newUser = { ...user, clapTime };
  const session = await database.updateSession({ sessionCode, users: { [userId]: newUser }});

  await fireEvent(sessionCode, 'update-state', sessionSerializer(session));

  return {
    statusCode: 200,
    body: JSON.stringify(sessionSerializer(session)),
  };
}
