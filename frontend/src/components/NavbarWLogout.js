import {React, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {NavLink, Navigate} from 'react-router-dom';
import logo from './logo2.jpg';
import PropTypes from 'prop-types';

function NavbarWLogout(props){

    const [loggedIn, setLoggedIn] = useState(true);

    const handleLogout = async () => {
        const response = await fetch('http://localhost:3050/logout', { method: 'GET' });
        const parsedResponse = await response.json();
        if (parsedResponse.logout) {
            setLoggedIn(false);
            props.logoutPressed();
        }
    };

    if(loggedIn){
        return(
                <div>
                    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
                        <NavLink className="navbar-brand" to='/'>
                            <img src={logo} alt='logo' />
                        </NavLink>
                        <div className='container-fluid'>
                            <NavLink className='navbar-brand' to='/'>ViMS</NavLink>
                            <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                                <span className='navbar-toggler-icon'></span>
                            </button>
                            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                                <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
                                <li className='nav-item text-nowrap'>
                                    <button className='btn nav-bar-sign-out' onClick={handleLogout} >
                                        Logout
                                    </button>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
        );
    }
    else{
        return <Navigate to='/login' />
    }
};

NavbarWLogout.propTypes = {
    logoutPressed: PropTypes.func.isRequired,
};

export default NavbarWLogout;