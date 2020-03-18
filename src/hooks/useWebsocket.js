import { useEffect } from 'react';
import Pusher from 'pusher-js';

const client = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export default function useWebsocket(channelName, callback) {
  useEffect(() => {
    const channel = client.subscribe(channelName);
    channel.bind_global(callback);

    return () => client.unsubscribe(channelName);
  }, [channelName, callback]);
}
