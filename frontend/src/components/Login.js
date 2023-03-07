import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import './Login.css';
import logo from './login.png';
import './icons/material-design-iconic-font.css';
import PropTypes from 'prop-types';
import Navbar from './Navbar.js';

function Login(props){

    const [user, setUser] = useState({
        email: '', password: '' 
    });

    function inputHandler(event){
        let fieldName = event.target.name;
        let value = event.target.value;
        setUser({...user, [fieldName]: value});
    };

    async function postData(event){
        event.preventDefault();
        const {email, password} = user;

        const res = await fetch('http://localhost:3050/login', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const parsedRes = await res.json();
        if(parsedRes.loginState){
            alert('Successful Login.');
            props.loginPressed();
        }
        else{
            alert('Invalid Email or Password. Please try again.');
        }
    };
    
    if(!props.loggedIn){
        return(
            <div>
                <Navbar />
                <section className='sign-in'>
                    <div className='container mt-5'>
                        <div className='signin-content'>

                            <div className='signin-image'>
                                <figure>
                                    <img src={logo} alt='Login' />
                                </figure>
                            <NavLink to='/register' className='signup-image-link'>Create an Account</NavLink>
                            </div>

                            <div className='signin-form'>
                                <h2 className='form-title'>Login</h2>
                                <form method='POST' className='register-form' id='register-form'>
                                    <div className='txt_field'>
                                        <input type='text' name='email' value={user.email} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-email'></i> Email</label>
                                    </div>
                                    <div className='txt_field'>
                                        <input type='password' name='password' value={user.password} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-lock'></i> Password</label>
                                    </div>
                                    <div className='submitButton'>
                                        <input type='submit' onClick={postData} value='Login' />
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

Login.propTypes = {
    loginPressed: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
};

export default Login;