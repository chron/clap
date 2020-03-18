import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Island, Stack } from './atoms/layout';
import { Heading } from './atoms/text';
import { TextField } from './atoms/inputs';
import { Button } from './atoms/buttons';

export default function Settings({ oldName = '', changeName }) {
  const [name, setName] = useState(oldName);
  const history = useHistory();

  const onChange = e => {
    setName(e.target.value);
  };

  const confirmNameChange = () => {
    changeName(name);
    history.push('/');
  }

  const onKeyPress = e => {
    if (e.key !== 'Enter') { return; }

    confirmNameChange();
  };

  return (
    <Island>
      <Stack>
        <Heading>Enter your name!</Heading>
        <TextField type="text" value={name} onChange={onChange} onKeyPress={onKeyPress}/>
        <Button onClick={confirmNameChange}>Save</Button>
      </Stack>
    </Island>
  );
};
