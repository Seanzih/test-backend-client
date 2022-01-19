import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './pages/admin';
import Home from './pages/home';
import Stats from './pages/stats';

import { setUserkey } from './utils/user.utils';

function App() {
  const generateUserKey = useCallback(setUserkey,[])
  
  useEffect(() => {
    generateUserKey()
  },[])


  return (
    <Router>
      <Switch>
        <Route path='/admin'>
          <Admin />
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/stats'>
          <Stats />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
