const add = require('date-fns/add');
const database = require('./lib/database');
const sessionSerializer = require('./lib/sessionSerializer');
const { fireEvent } = require('./lib/websockets');

exports.handler = async function(event, _context) {
  const { sessionCode, userId } = event.queryStringParameters;

  if (!userId) return { statusCode: 422, body: 'userId must be provided' };

  const { targetTime, users }  = await database.findSession(sessionCode);
  const currentUser = users[userId];

  if (!currentUser) return { statusCode: 422, body: 'Invalid user' };
  if (!sessionCode) return { statusCode: 404 };
  if (targetTime) return { statusCode: 422 }; // already started!

  const newUsers = { [userId]: { ready: true }};

  let newTargetTime;

  if (Object.values({ ...users, ...newUsers }).find(({ ready }) => !ready) === undefined) {
    newTargetTime = add(new Date, { seconds: 7 }).toISOString();
  }

  const session = await database.updateSession({ sessionCode, users: newUsers, targetTime: newTargetTime });

  await fireEvent(sessionCode, 'update-state', sessionSerializer(session));

  return {
    statusCode: 200,
    body: JSON.stringify(sessionSerializer(session)),
  };
}
