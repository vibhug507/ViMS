import {React, useEffect, useState} from 'react';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
      async function fetchData(){
        const res = await fetch('http://localhost:3050/isLoggedIn', {method: 'GET'});
        const parsedResult = await res.json();
        setLoggedIn(parsedResult.isLoggedIn);
      };
      fetchData();
    });

    const logoutPressed = () => {
      setLoggedIn(false);
    };

    const loginPressed = () => {
      setLoggedIn(true);
    };

    return (
      <Router>
        <Switch>
          <Route exact path='/register'>
            <Signup />
          </Route>
          <Route exact path='/userProfile'>
            <UserProfile logoutPressed={logoutPressed} />
          </Route>
          <Route exact path='/login'>
            {!loggedIn ? (
              <Login loginPressed={loginPressed} loggedIn={loggedIn} />
            ) : (
              <UserProfile logoutPressed={logoutPressed} />
            )}
          </Route>
          <Route exact path='/'>
            {loggedIn ? <UserProfile logoutPressed={logoutPressed} /> : <Home />}
          </Route>
          <Route exact path='/contact'>
            <Contact />
          </Route>
        </Switch>
      </Router>
    );
}

export default App;
