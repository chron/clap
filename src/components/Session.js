import React, { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import throttle from 'lodash.throttle';
import useMicrophoneVolume from '../hooks/useMicrophoneVolume';
import Sidebar from './Sidebar';
import VolumeDisplay from './VolumeDisplay';
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
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const fadeOut = keyframes`
  from { opacity: 0.9; }
  to { opacity: 0; }
`;

const Clap = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255);
  animation: ${fadeOut} 0.3s ease-in 0s 1 forwards;
  pointer-events: none;
`;


export default function Session({ currentUser, users, targetTime, onClap, onReady }) {
  const [countdown, setCountdown] = useState(null);
  const [volume, setVolume] = useState(null);
  const [clapped, setClapped] = useState(false);
  const [clapThreshold, setClapThreshold] = useState(70);

  const throttledSetVolume = useCallback(throttle(v => {
    setVolume(v);
  }, 100), [setVolume]);

  let sessionState;

  if (targetTime && differenceInMilliseconds(new Date(), targetTime) >= 2500) {
    sessionState = 'finished';
  } else if (targetTime) {
    sessionState = 'active';
  } else {
    sessionState = 'ready';
  }

  const handleClap = e => {
    if (clapped) { return; }
    if (!currentUser) { return; }
    if (currentUser.clapTime) { return; }
    if (sessionState !== 'active') { return; }
    if (e && e.code && e.code !== 'Space') { return; } // for key event only

    e?.preventDefault();

    onClap();
    setClapped(true);
  };

  useMicrophoneVolume(v => {
    throttledSetVolume(v);
  }, [throttledSetVolume]);

  useEffect(() => {
    if (!clapped && volume > clapThreshold) {
      handleClap();
    }
  }, [clapped, volume]);

  useEffect(() => {
    document.addEventListener('keydown', handleClap);
    return () => document.removeEventListener('keydown', handleClap);
  });

  useEffect(() => {
    if (sessionState === 'active') {
      const interval = setInterval(() => {
        setCountdown(differenceInMilliseconds(targetTime, new Date));
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
      {clapped && <Clap />}

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
            <VolumeDisplay volume={volume} clapThreshold={clapThreshold} setClapThreshold={setClapThreshold} />
            <HelpText>Paste this link to the other people who will be joining:</HelpText>
            <TextField readonly onClick={copyUrl} defaultValue={window.location.href} />
            <HelpText>The clap will begin when everyone present is ready</HelpText>
            <Button
              onClick={onReady}
              disabled={currentUser.ready}
            >
              {currentUser.ready ? 'Waiting for the others...' : "I'm ready!"}
            </Button>
          </Stack>
        )}
        {sessionState === 'active' && countdown !== null && (
          <Stack>
            {currentUser && !currentUser.clapTime && (
              <>
                <VolumeDisplay volume={volume} clapThreshold={clapThreshold} setClapThreshold={setClapThreshold} />
                <HelpText>Hit <kbd>Space</kbd> or click the button as close to zero as you can!</HelpText>
                <Button disabled={clapped} onClick={handleClap}>Clap!</Button>
              </>
            )}
            <Countdown>{countdown >= 0 ? (countdown / 1000).toFixed(1) : '👏🏼'}</Countdown>
          </Stack>
        )}
      </Display>
    </SessionWrapper>
  );
}
