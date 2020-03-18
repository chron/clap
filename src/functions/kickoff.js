const add = require('date-fns/add');
const database = require('./lib/database');
const { fireEvent } = require('./lib/websockets');

exports.handler = async function(event, _context) {
  const { sessionCode } = event.queryStringParameters;
  const { targetTime }  = await database.findSession(sessionCode);

  if (!sessionCode) return { statusCode: 404 };
  if (targetTime) return { statusCode: 422 }; // already started!

  const newTargetTime = add(new Date, { seconds: 10 }).toISOString();
  const session = await database.updateSession({ sessionCode, targetTime: newTargetTime });

  await fireEvent(sessionCode, 'update-state', session);

  return {
    statusCode: 200,
    body: JSON.stringify(session),
  };
}
