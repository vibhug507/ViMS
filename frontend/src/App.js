import {React, useEffect, useState} from 'react';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
      async function fetchData(){
        const res = await fetch('http://localhost:3050/isLoggedIn', {method: 'GET'});
        const parsedResult = await res.json();
        console.log(parsedResult);
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
        <Routes>
          <Route path='/register' element={<Signup />} />
          <Route path='/userProfile' element={<UserProfile logoutPressed={logoutPressed} />} />
          <Route path='/login' element={!loggedIn ? (
            <Login loginPressed={loginPressed} loggedIn={loggedIn} />
          ) : (
            <UserProfile logoutPressed={logoutPressed} />
          )} />
          <Route path='/' element={loggedIn ? <UserProfile logoutPressed={logoutPressed} /> : <Home />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Router>
    );
}

export default App;
