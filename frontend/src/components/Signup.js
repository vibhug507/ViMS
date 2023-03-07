import React, {useState} from 'react';
import {Navigate, NavLink} from 'react-router-dom';
import './Signup.css';
import logo from './signup.jpg';
import './icons/material-design-iconic-font.css';
import Navbar from './Navbar.js';

function Signup(){

    let [user, setUser] = useState({
        name: '', enrollmentNumber: '', email: '', password: '', contactNumber: '', address: '' 
    });
    let [registerStatus, setRegisterStatus] = useState(false);

    function inputHandler(event){
        let fieldName = event.target.name;
        let value = event.target.value;
        setUser({...user, [fieldName]: value});
    };

    async function postData(event){
        event.preventDefault();
        const {name, enrollmentNumber, email, password, contactNumber, address} = user;

        const res = await fetch('http://localhost:3050/signup', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {name, enrollmentNumber, email, password, contactNumber, address}
            )
        });

        const parsedRes = await res.json();
        if(parsedRes.registered){
            alert('Signup Successful.');
            setRegisterStatus(true);
        }
        else{
            alert('Account already exists or the entered details are invalid.');
        }
        setUser({name: '', enrollmentNumber: '', email: '', password: '', contactNumber: '', address: '' });
    };

    if(!registerStatus){
        return (
            <div>
                <Navbar />
                <section className='signup'>
                    <div className='container mt-5'>
                        <div className='signup-content'>
                            <div className='signup-form'>
                                <h2 className='form-title'>Signup</h2>
                                <form method='POST' className='register-form' id='register-form'>
                                    <div className='txt_field'>
                                        <input type='text' name='name' value={user.name} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-account'></i> Name</label>
                                    </div>
                                    <div className='txt_field'>
                                        <input type='text' name='enrollmentNumber' value={user.enrollmentNumber} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-graduation-cap'></i> Enrollment Number</label>
                                    </div>
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
                                    <div className='txt_field'>
                                        <input type='text' name='contactNumber' value={user.contactNumber} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-phone-in-talk'></i> Contact Number</label>
                                    </div>
                                    <div className='txt_field'>
                                        <input type='text' name='address' value={user.address} onChange={inputHandler} required />
                                        <span></span>
                                        <label><i className='zmdi zmdi-pin'></i> Address</label>
                                    </div>
                                    <div className='submitButton'>
                                        <input type='submit' onClick={postData} value='Signup' name='signup'/>
                                    </div>
                                </form>
                            </div>

                            <div className='signup-image'>
                                <figure>
                                    <img src={logo} alt='Signup' />
                                </figure>
                                <NavLink to='/login' className='signup-image-link'>Already registered ?</NavLink>
                            </div>
                        </div>

                    </div>
                </section>

            </div>

        );
    }
    else{
        return <Navigate to='/login' />
    }
};

export default Signup;
