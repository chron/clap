import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { recentSessions as getRecentSessions } from '../lib/api';
import { Island, Stack } from './atoms/layout';
import { Heading } from './atoms/text';
import { Button } from './atoms/buttons';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

const RecentSessionGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-row-gap: 20px;
  align-items: center;
`;

const UserList = styled.ul`
  margin: 0;
  list-style-type: none;

  > li {
    margin: 0;
  }
`
export default function Home() {
  const history = useHistory();
  const [recentSessions, setRecentSessions] = useState(null);

  useEffect(() => {
    getRecentSessions()
      .then(s => setRecentSessions(s.sessions))
      .catch(e => console.error(e));
  }, []);

  const generateSessionCode = () => {
    const sessionCode = [...Array(8)].map(() => Math.random().toString(36)[2]).join('');
    history.push(`/${sessionCode}`);
  }

  return (
    <Island>
      <Stack>
        <Heading>Synchronized clap time</Heading>
        <Button onClick={generateSessionCode}>Start a new clap</Button>
        <RecentSessionGrid>
          {recentSessions && recentSessions.map(({ sessionCode, users, targetTime }) => (
            <React.Fragment key={sessionCode}>
              <div><a href={`/${sessionCode}`}>{sessionCode}</a></div>
              <UserList>
                {users.map(({ name, emoji, clapTime}) => {
                  const time = clapTime && targetTime && differenceInMilliseconds(Date.parse(targetTime), Date.parse(clapTime));

                  return (
                    <li key={name}>
                      {emoji} {name}
                      {time && `(${time}ms)`}
                    </li>
                  );
                })}
              </UserList>
            </React.Fragment>
          ))}
        </RecentSessionGrid>
      </Stack>
    </Island>
  );
};
