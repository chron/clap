import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Island, Stack } from './atoms/layout';
import { Heading, HelpText} from './atoms/text';
import { TextField } from './atoms/inputs';
import { Button } from './atoms/buttons';

export default function Settings({ oldName, oldAvatar, changeName, changeAvatar }) {
  const [name, setName] = useState(oldName);
  const [avatar, setAvatar] = useState(oldAvatar);

  const history = useHistory();

  const confirmChanges = () => {
    changeName(name);
    changeAvatar(avatar);
    history.push('/');
  }

  const onKeyPress = e => {
    if (e.key !== 'Enter') { return; }

    confirmChanges();
  };

  return (
    <Island>
      <Stack>
        <Heading>Enter your name!</Heading>
        <TextField type="text" value={name} onChange={e => setName(e.target.value)} onKeyPress={onKeyPress}/>

        <Heading>Emoji avatar</Heading>
        <HelpText>Try <kbd>ctrl</kbd> + <kbd>cmd</kbd> + <kbd>space</kbd> on mac to get the picker!</HelpText>
        <TextField
          type="text"
          value={avatar}
          onClick={e => e.target.select()}
          onChange={e => setAvatar([...e.target.value][0] || '')}
          onKeyPress={onKeyPress}
        />

        <Button onClick={confirmChanges}>Save</Button>
      </Stack>
    </Island>
  );
};
