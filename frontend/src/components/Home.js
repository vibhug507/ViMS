import React from 'react';
import logo from './instituteLogo.png';

function Home(){

    return(
        <>
            <div className="container mt-5">
                <h2 className="profile-label">Visitor Management System (ViMS)</h2>
            </div>
            <div>
                <figure>
                    <img src={logo} alt="Logo" className="insititute-logo"/>
                </figure>
            </div>
        </>
    );

};

export default Home;