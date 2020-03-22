import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { Island } from './atoms/layout';
import SessionLoader from './SessionLoader';
import Settings from './Settings';
import Home from './Home';

function generateUserId() {
  return [...Array(10)].map(() => Math.random().toString(36)[2]).join('');
}

export default function App() {
  const [name, setName] = useLocalStorage('username', '');
  const [avatar, setAvatar] = useLocalStorage('avatar', '👩🏻‍💻');
  const [userId, setUserId] = useLocalStorage('userId', null);

  useEffect(() => {
    if (!userId) { setUserId(generateUserId()); }
  }, [userId, setUserId, generateUserId]);

  const matchSettings = useRouteMatch('/settings');
  const location = useLocation();

  if (!matchSettings && name === '') return <Redirect to={{ pathname: "/settings", from: location.pathname }} />;

  return (
    <Switch>
      <Route exact path="/settings">
        <Settings
          oldName={name}
          changeName={setName}
          oldAvatar={avatar}
          changeAvatar={setAvatar}
        />
      </Route>

      <Route exact path="/:sessionCode">
        <SessionLoader userName={name} userId={userId} avatar={avatar} />
      </Route>

      <Route exact path="/">
        <Home />
      </Route>

      <Route>
        <Island>
          <h1>404</h1>
        </Island>
      </Route>
    </Switch>
  );
}
