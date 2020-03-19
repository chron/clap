import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { joinSession, kickoff, clap } from '../lib/api';
import useWebsocket from '../hooks/useWebsocket';
import Session from './Session';
import Spinner from './Spinner';
import { Island } from './atoms/layout';
import clapUrl from '../audio/clap.wav';

export default function SessionLoader({ userName, avatar }) {
  const { sessionCode } = useParams();
  const [session, setSession] = useState([]);
  const [state, setState] = useState('idle');
  const [clapInFlight, setClapInFlight] = useState(false);

  useEffect(() => {
    if (sessionCode && state === 'idle') {
      setState('loading');

      // TODO: we're kinda double updating since the websockets fire here too
      joinSession(sessionCode, userName, avatar).then(sessionData => {
        setSession(sessionData);
        setState('ready');
      }).catch(e => setState('error'));
    }
  }, [sessionCode, state]);

  const websocketCallback = useCallback((event, newState) => {
    if (event === 'update-state') {
      setSession(newState);
    }
  }, [setState]);

  useWebsocket(sessionCode, websocketCallback);

  if (state === 'loading' || state === 'idle') return <Island><Spinner /></Island>;
  if (state === 'error') return <Island><h1>Error</h1></Island>;

  const onClap = () => {
    if (clapInFlight) return;

    setClapInFlight(true);
    clap(sessionCode, userName)
      .then(() => setClapInFlight(false))
      .catch(e => console.error(e));
    const clapWav = new Audio(clapUrl);
    clapWav.play();
  };

  const onKickoff = () => {
    kickoff(sessionCode).catch(e => console.error(e));
  }

  const targetTime = session.targetTime ? Date.parse(session.targetTime) : null;
  const users = session.users.map(u => ({ ...u, clapTime: u.clapTime ? Date.parse(u.clapTime) : null }));
  const currentUser = users.find(u => u.name === userName);

  return (
    <Session
      currentUser={currentUser}
      users={users}
      targetTime={targetTime}
      onClap={onClap}
      onKickoff={onKickoff}
    />
  );
}
