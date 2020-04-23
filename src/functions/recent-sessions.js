const database = require('./lib/database');
const sessionSerializer = require('./lib/sessionSerializer');

exports.handler = async function(_event, _context) {
  const recentSessions = await database.recentSessions(10);
  const sessions = recentSessions.map(s => sessionSerializer(s));

  return {
    statusCode: 200,
    body: JSON.stringify({ sessions }),
  };
}
