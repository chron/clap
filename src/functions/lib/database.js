const { query, Client } = require('faunadb');
require('dotenv');

const { Map, Get, Paginate, Filter, Match, Not, Equals, Select, Index, Var, Lambda, Collection, Create, Update } = query;

function client() {
  return new Client({ secret: process.env.FAUNADB_SECRET_KEY });
};

module.exports.recentSessions = async function(n) {
  try {
    const r = await client().query(
      Map(
        Paginate(
          Filter(
            Match(Index('recent_sessions')),
            Lambda(['date', 'ref'], Not(Equals(null, Var('date'), null)))
          ),
          { size: n }
        ),
        Lambda(['date', 'ref'], Get(Var('ref')))
      )
    );

    return r.data.map(s => s.data);
  } catch (e) {
    console.error(e);
    return [];
  }
};

module.exports.findSession = async function(sessionCode) {
  try {
    const r = await client().query(Get(Match(Index('sessions_by_code'), sessionCode)));
    return r.data;
  } catch (e) {
    return null;
  }
}

module.exports.createSession = async function(sessionCode, userName, userId, emoji) {
  const createdAt = (new Date()).toISOString();
  const data = { sessionCode, users: { [userId]: { name: userName, emoji }}, createdAt };

  const response = await client().query(Create(Collection('sessions'), { data }));

  return response.data;
}

module.exports.updateSession = async function(data) {
  const updatedAt = (new Date()).toISOString();

  const response = await client().query(
    Update(
      Select(
        ["ref"],
        Get(Match(Index('sessions_by_code'), data.sessionCode))
      ),
      { data: { ...data, updatedAt }}
    )
  );

  return response.data;
}
