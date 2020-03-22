const { query, Client } = require('faunadb');
require('dotenv');

const { Map, Get, Paginate, Match, Index, Var, Lambda, Collection, Create, Update } = query;
const client = new Client({ secret: process.env.FAUNADB_SECRET_KEY });

module.exports.findSession = async function(sessionCode) {
  const r = await client.query(
    Map(
      Paginate(Match(Index('sessions_by_code'), sessionCode)),
      Lambda('ref', Get(Var('ref')))
    )
  );

  if (r.data[0]) {
    return r.data[0].data;
  } else {
    return null;
  }
}

module.exports.createSession = async function(sessionCode, userName, userId, emoji) {
  const data = { sessionCode, users: { [userId]: { name: userName, emoji }} };
  const response = await client.query(Create(Collection('sessions'), { data }));
  return response.data;
}

module.exports.updateSession = async function(data) {
  const { data: [ref] } = await client.query(
    Paginate(Match(Index('sessions_by_code'), data.sessionCode))
  );

  const r = await client.query(Update(ref, { data }));
  return r.data;
}
