const database = require('./lib/database');
const { fireEvent } = require('./lib/websockets');
const differenceInSeconds = require('date-fns/differenceInSeconds');

exports.handler = async function(event, _context) {
  const { sessionCode, userName } = event.queryStringParameters;
  const { targetTime, users } = await database.findSession(sessionCode);
  const userIndex = users.findIndex(u => u.name === userName);

  if (!sessionCode) return { statusCode: 404 };
  if (userIndex < 0) return { statusCode: 422 }; // user doesn't exist
  if (!targetTime) return { statusCode: 422 }; // hasn't started
  if (targetTime && differenceInSeconds(new Date(), Date.parse(targetTime)) >= 5) return { statusCode: 422 }; // finished

  const clapTime = (new Date).toISOString();

  const newUsers = users.slice();
  newUsers.splice(userIndex, 1, { ...users[userIndex], clapTime });
  const session = await database.updateSession({ sessionCode, users: newUsers });

  fireEvent(sessionCode, 'update-state', session);

  return {
    statusCode: 200,
    body: JSON.stringify(session),
  };
}
