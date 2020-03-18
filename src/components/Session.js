import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import Sidebar from './Sidebar';
import { Island, Stack } from './atoms/layout';
import { Button } from './atoms/buttons';
import { HelpText } from './atoms/text';
import { Link } from './atoms/navigation';
import { TextField } from './atoms/inputs';

const SessionWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Display = styled(Island)`
  flex-grow: 1;
`;

const Countdown = styled.div`
  font-size: 200px;
`;

export default function Session({ currentUser, users, targetTime, onClap, onKickoff }) {
  const [countdown, setCountdown] = useState(null);
  const match = useRouteMatch();
  let sessionState;

  if (targetTime && differenceInSeconds(new Date(), targetTime) >= 5) {
    sessionState = 'finished';
  } else if (targetTime) {
    sessionState = 'active';
  } else {
    sessionState = 'ready';
  }

  const handleClap = e => {
    if (!currentUser) { return; }
    if (currentUser.clapTime) { return; }
    if (sessionState !== 'active') { return; }
    if (e.code !== 'Space') { return; }

    e.preventDefault();

    // TODO: clap sound?
    onClap();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleClap);
    return () => document.removeEventListener('keydown', handleClap);
  });

  useEffect(() => {
    if (sessionState === 'active') {
      const interval = setInterval(() => {
        setCountdown(differenceInSeconds(targetTime, new Date));
      }, 100);

      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [sessionState, targetTime, setCountdown]);

  const copyUrl = e => {
    e.target.select();
    document.execCommand('copy');
  }

  return (
    <SessionWrapper>
      <Sidebar currentUser={currentUser} users={users} targetTime={targetTime} />

      <Display>
        {sessionState === 'finished' && (
          <Stack>
            <HelpText>The clap is finished.</HelpText>
            <Link to="/">Back home</Link>
          </Stack>
        )}
        {sessionState === 'ready' && (
          <Stack>
            <HelpText>Paste this link to the other people who will be joining:</HelpText>
            <TextField readonly onClick={copyUrl} defaultValue={window.location.href} />
            <HelpText>Then, once everyone is ready...</HelpText>
            <Button onClick={onKickoff}>Start the countdown</Button>
          </Stack>
        )}
        {sessionState === 'active' && countdown !== null && (
          <Stack>
            <HelpText>Hit <kbd>Space</kbd> as close to zero as you can!</HelpText>
            <Countdown>{countdown >= 0 ? countdown : '👏🏼'}</Countdown>
          </Stack>
        )}
      </Display>
    </SessionWrapper>
  );
}
