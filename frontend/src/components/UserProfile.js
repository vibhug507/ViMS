import React, {useState, useEffect, useRef} from 'react';
import {Navigate} from 'react-router-dom';
import './UserProfile.css'
import NavbarWLogout from './NavbarWLogout.js';
import PropTypes from 'prop-types';

function UserProfile(props){
    let loggedIn = useRef(null);
    const [isLoggedIn, setLoggedIn] = useState(loggedIn);
    const [loggedInUser, setLoggedInUser] = useState({});

    useEffect(() => {
        async function fetchData() {
          const result = await fetch('http://localhost:3050/isLoggedIn', { method: 'GET' });
          const parsedResult = await result.json();
          loggedIn.current = parsedResult.isLoggedIn;
    
          setLoggedInUser(parsedResult.user);
          setLoggedIn(loggedIn.current);
        }
        fetchData();
    }, []);

    const logoutPressed = () => {
        setLoggedIn(false);
        setLoggedInUser(null);
        props.logoutPressed();
    };

    const [visit, setVisit] = useState({secondPerson: '', duration: '', startTime: ''});

    function inputHandler(event){
        let fieldName = event.target.name;
        let value = event.target.value;
        setVisit({...visit, [fieldName]: value});
    }

    async function scheduleVisit(event){
        event.preventDefault();
        const result = await fetch('http://localhost:3050/scheduleVisit', {method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(visit)
        });
        const parsedResult = await result.json();
        setVisit({secondPerson: '', duration: '', startTime: ''});
        if(parsedResult.status === 'success'){
            alert('Visit Scheduled');
        }
        else{
            alert('Visit could not scheduled. Please try again.');
        }

    }

    if(isLoggedIn && loggedInUser){
        return(
            <div>
                <NavbarWLogout logoutPressed={logoutPressed} />
                <div className='container mt-5'>
                        <h2 className='profile-label'>Your Profile</h2>
                        <div className='about-info'>
                            <div>
                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <p className='lbl'>Name</p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='lbl'>{loggedInUser.name}</p>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <p className='lbl'>Enrollment Number</p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='lbl'>{loggedInUser.enrollmentNumber}</p>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <p className='lbl'>Email</p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='lbl'>{loggedInUser.email}</p>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <p className='lbl'>Contact Number</p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='lbl'>{loggedInUser.contactNumber}</p>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col-md-6'>
                                        <p className='lbl'>Address</p>
                                    </div>
                                    <div className='col-md-6'>
                                        <p className='lbl'>{loggedInUser.address}</p>
                                    </div>
                                </div>    
                            
                            </div>
                        </div>

                    <div className='signin-form'>
                        <h2 className='form-title'>Schedule a Visit</h2>
                        <p className='visitInstructions'><i>Enter the following details to schedule a visit. If the visit is possible, then check your email for the issue pass.</i></p>
                        <form method='POST' className='register-form' id='register-form'>
                            <div className='txt_field'>
                                <input type='text' name='secondPerson' value={visit.secondPerson} onChange={inputHandler} required />
                                <span></span>
                                <label>Second Person</label>
                            </div>
                            <div className='txt_field'>
                                <input type='text' name='duration' value={visit.duration} onChange={inputHandler} required />
                                <span></span>
                                <label>Duration (in minutes)</label>
                            </div>
                            <div className='txt_field'>
                                <input type='text' name='startTime' value={visit.startTime} onChange={inputHandler} required />
                                <span></span>
                                <label>Start Time (format : HH:MM)</label>
                            </div>
                            <div className='scheduleButton'>
                                <input type='submit' onClick={scheduleVisit} value='Schedule' />
                            </div>
                        </form>

                    </div>

                </div>   
            </div>
        );
    }
    else{
        return <Navigate to='/login' />;
    }
};

UserProfile.propTypes = {
    logoutPressed: PropTypes.func.isRequired,
};

export default UserProfile;