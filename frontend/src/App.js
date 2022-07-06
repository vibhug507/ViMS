import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import './App.css';


function App() {
  return (
    <>
      <Navbar />
      <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/userProfile' element={<UserProfile />} />
      </Routes>
      </div>
    </>
  );
}

export default App;
