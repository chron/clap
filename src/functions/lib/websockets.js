const Pusher = require('pusher');

const client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

module.exports.fireEvent = async function(channel, event, message, socketId) {
  return new Promise((resolve, _reject) => {
    client.trigger(channel, event, message, socketId, resolve);
  });
}
