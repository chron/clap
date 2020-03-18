import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Island, Stack } from './atoms/layout';
import { Heading } from './atoms/text';
import { Button } from './atoms/buttons';

export default function Home() {
  const history = useHistory();

  const generateSessionCode = () => {
    const sessionCode = [...Array(8)].map(() => Math.random().toString(36)[2]).join('');
    history.push(`/${sessionCode}`);
  }

  return (
    <Island>
      <Stack>
        <Heading>Synchronized clap time</Heading>
        <Button onClick={generateSessionCode}>Create a new lobby</Button>
      </Stack>
    </Island>
  );
};
