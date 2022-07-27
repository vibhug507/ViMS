import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './UserProfile.css'

function UserProfile(){

    const [user, setUser] = useState({name: "", enrollmentNumber: "", email: "", 
                                      password: "", contactNumber: "", address: ""});

    const navigate = useNavigate();

    useEffect(
        function(){
            console.log('hi');
            fetch('http://localhost:3050/login', {method: 'GET'})
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if(!json.isLoggedIn){
                    navigate('/login');
                }
                else{
                    setUser(json.loggedInUser);
                }
            })
        }, [navigate]
    )

    const [visit, setVisit] = useState({secondPerson: "", duration: "", startTime: ""});

    function inputHandler(event){
        let fieldName = event.target.name;
        let value = event.target.value;
        setVisit({...user, [fieldName]: value});
    }

    function scheduleVisit(event){
        event.preventDefault();
        fetch('http://localhost:3050/scheduleVisit', {method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(visit)
        })
    }

    function logout(event){
        event.preventDefault();
        fetch('http://localhost:3050/logout', {method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        })
        navigate('/login');
    }

    return(
    <div className="container mt-5">
            <h2 className="profile-label">Your Profile</h2>
            <button className="logoutButton" onClick={logout}>Logout</button>
            <div className="about-info">
                <div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p className="lbl">Name</p>
                        </div>
                        <div className="col-md-6 ">
                            <p className="lbl">{user.name}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p className="lbl">Enrollment Number</p>
                        </div>
                        <div className="col-md-6">
                            <p className="lbl">{user.enrollmentNumber}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p className="lbl">Email</p>
                        </div>
                        <div className="col-md-6">
                            <p className="lbl">{user.email}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p className="lbl">Contact Number</p>
                        </div>
                        <div className="col-md-6">
                            <p className="lbl">{user.contactNumber}</p>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p className="lbl">Address</p>
                        </div>
                        <div className="col-md-6">
                            <p className="lbl">{user.address}</p>
                        </div>
                    </div>    
                
                </div>
            </div>

        <div className="signin-form">
            <h2 className="form-title">Schedule a Visit</h2>
            <p className="visitInstructions"><i>Enter the following details to schedule a visit. If the visit is possible, then check your email for the issue pass.</i></p>
            <form method="POST" className="register-form" id="register-form">
                <div className="txt_field">
                    <input type="text" name="secondPerson" value={visit.secondPerson} onChange={inputHandler} required />
                    <span></span>
                    <label>Second Person</label>
                </div>
                <div className="txt_field">
                    <input type="text" name="duration" value={visit.duration} onChange={inputHandler} required />
                    <span></span>
                    <label>Duration (in minutes)</label>
                </div>
                <div className="txt_field">
                    <input type="text" name="startTime" value={visit.startTime} onChange={inputHandler} required />
                    <span></span>
                    <label>Start Time (format : HH:MM)</label>
                </div>
                <div className="scheduleButton">
                    <input type="submit" onClick={scheduleVisit} value="Schedule" />
                </div>
            </form>

        </div>

    </div>
           
    );

};

export default UserProfile;