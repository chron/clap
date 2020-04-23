require('dotenv').config({ path: '../.env' });
const { query, Client } = require('faunadb');
const { CreateIndex, Collection } = query;

const client = new Client({ secret: process.env.FAUNADB_SECRET_KEY });

const r = client.query(
  CreateIndex({
    name: 'recent_sessions',
    source: Collection('sessions'),
    values: [
      { field: ['data', 'createdAt'], reverse: true },
      { field: ['ref'] }
    ],
  })
).then(r => {
  console.log(r);
}).catch(e => {
  console.error(e);
});
