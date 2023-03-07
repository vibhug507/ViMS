import React from 'react';
import logo from './instituteLogo.png';
import Navbar from './Navbar.js';

function Home(){
    return(
            <div>
                <Navbar />
                <div className='container mt-5'>
                    <h2 className='profile-label'>Visitor Management System (ViMS)</h2>
                </div>
                <div>
                    <figure>
                        <img src={logo} alt='Logo' className='insititute-logo'/>
                    </figure>
                </div>
            </div>
    );
};

export default Home;