import React from 'react';
import styled from 'styled-components';
import { Stack } from './atoms/layout';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

const SidebarWrapper = styled.div`
  height: 100%;
  padding: 20px 50px;
  border-right: 4px solid black;
  background-color: ${p => p.theme.sidebarColor};
`;

const UserList = styled.ul`
  font-size: 40px;
`;

const User = styled.li`
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  min-height: 100px;
  margin-right: 20px;
  font-size: 60px;
  border-radius: 60px;
  background-color: ${p => p.currentUser ? p.theme.activeColor : p.theme.inactiveColor};
`;

export default function Sidebar({ currentUser, users, targetTime }) {
  return (
    <SidebarWrapper>
      <UserList>
        {users.map(({ name, emoji, clapTime }) => (
          <User key={name}>
            <Avatar currentUser={currentUser?.name === name }>{emoji}</Avatar>
            <Stack>
              <span>{name}</span>
              {targetTime && clapTime && <span>{differenceInMilliseconds(targetTime, clapTime)}ms</span>}
            </Stack>
          </User>
        ))}
      </UserList>
    </SidebarWrapper>
  );
}
