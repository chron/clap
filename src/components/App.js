import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { Island } from './atoms/layout';
import SessionLoader from './SessionLoader';
import Settings from './Settings';
import Home from './Home';

export default function App() {
  const [name, setName] = useLocalStorage('username', '');
  const [avatar, setAvatar] = useLocalStorage('avatar', '👩🏻‍💻');

  const match = useRouteMatch('/settings');

  if (!match && name === '') return <Redirect to="/settings" />;

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
        <SessionLoader userName={name} avatar={avatar} />
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
