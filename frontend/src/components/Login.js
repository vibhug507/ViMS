import React, {useState, useEffect} from 'react';
import {useNavigate, NavLink} from 'react-router-dom';
import './Login.css';
import logo from './login.png';
import './icons/material-design-iconic-font.css';

function Login(){

    const [user, setUser] = useState({
        email: "", password: "" 
    })

    const navigate = useNavigate();

    function inputHandler(event){
        let fieldName = event.target.name;
        let value = event.target.value;
        setUser({...user, [fieldName]: value});
    }

    function postData(event){
        event.preventDefault();
        const {email, password} = user;

        fetch('http://localhost:3050/login', {method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({email, password})
        })

        navigate('/userProfile');
    }

    useEffect(
        function(){
            fetch('http://localhost:3050/login', {method: 'GET'})
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if(json.loggedIn){
                    navigate('/userProfile');
                }
            })
        }
    )
    
    return(
        <div>
            <section className="sign-in">
                <div className="container mt-5">
                    <div className="signin-content">

                        <div className="signin-image">
                            <figure>
                                <img src={logo} alt="Login" />
                            </figure>
                        <NavLink to="/signup" className="signup-image-link">Create an Account</NavLink>
                        </div>

                        <div className="signin-form">
                            <h2 className="form-title">Login</h2>
                            <form method="POST" className="register-form" id="register-form">
                                <div className="txt_field">
                                    <input type="text" name="email" value={user.email} onChange={inputHandler} required />
                                    <span></span>
                                    <label><i className="zmdi zmdi-email"></i> Email</label>
                                </div>
                                <div className="txt_field">
                                    <input type="password" name="password" value={user.password} onChange={inputHandler} required />
                                    <span></span>
                                    <label><i className="zmdi zmdi-lock"></i> Password</label>
                                </div>
                                <div className="submitButton">
                                    <input type="submit" onClick={postData} value="Login" />
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;