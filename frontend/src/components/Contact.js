import React, {useState} from 'react';
import Navbar from './Navbar.js';

function Contact(){

    const [userData, setUserData] = useState({name: '', email: '', phone: '', message: ''});

    const inputHandler = function (event){
        const fieldName = event.target.name;
        const value = event.target.value;
        setUserData({...userData, [fieldName]: value});
    };

    async function postData(event){
        event.preventDefault();
        const {name, email, phone, message} = userData;

        const result = await fetch('http://localhost:3050/contact', {
            method: 'POST', headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, phone, message})
        });

        const parsedResult = await result.json();
        if(parsedResult.status === 'success'){
            alert('Message Sent Successfully.');
        }
        else{
            alert('Message could not be sent.');
        }
        setUserData({name: '', email: '', phone: '', message: ''});
    };

    return (
        <div>
            <Navbar />
            <div className='contact_info'>
                <div className='container-xxl'>
                    <div className='row'>
                        <div className='col-lg-10 offset-lg-1'>
                            <div className='contact_info_container d-flex flex-lg-row flex-column justify-content-between align-items-between'>
                                <div className='contact_info_item d-flex flex-row align-items-center justify-content-start'>
                                    <div className='contact_info_image'>
                                    <img src='https://img.icons8.com/office/24/000000/iphone.png' alt='' /></div>
                                    <div className='contact_info_content'>
                                        <div className='contact_info_title'>Phone</div>
                                        <div className='contact_info_text'>+91-7982773137</div>
                                    </div>
                                </div> 
                                <div className='contact_info_item d-flex flex-row align-items-center justify-content-start'>
                                    <div className='contact_info_image'><img src='https://img.icons8.com/ultraviolet/24/000000/filled-message.png' alt='' /></div>
                                    <div className='contact_info_content'>
                                        <div className='contact_info_title'>Email</div>
                                        <div className='contact_info_text'>vibhugarg507@gmail.com</div>
                                    </div>
                                </div> 
                                <div className='contact_info_item d-flex flex-row align-items-center justify-content-start'>
                                    <div className='contact_info_image'><img src='https://img.icons8.com/ultraviolet/24/000000/map-marker.png' alt='' /></div>
                                    <div className='contact_info_content'>
                                        <div className='contact_info_title'>Address</div>
                                        <div className='contact_info_text'>Allahabad, India</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='contact_form'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-10 offset-lg-1'>
                            <div className='contact_form_container py-5'>
                                <div className='contact_form_title'>
                                    Get in Touch </div>
                                <form method='POST' id='contact_form'>
                                     <div className='contact_form_inputs d-flex flex-md-row flex-column justify-content-between align-items-between'> 
                                        <input type='text' id='contact_form_name'
                                            className='contact_form_name input_field'
                                                name='name'
                                            value={userData.name}
                                            onChange={inputHandler}
                                            placeholder='Your name' required />
                                        
                                         <input type='text' id='contact_form_email'
                                            className='contact_form_email input_field'
                                                name='email'
                                            value={userData.email}
                                            onChange={inputHandler}
                                            placeholder='Your Email' required />
                                        
                                         <input type='text' id='contact_form_phone'
                                            className='contact_form_phone input_field'
                                            name='phone'
                                        value={userData.phone}
                                        onChange={inputHandler}
                                        placeholder='Your Phone Number' required  />
                                    </div>

                                    <div className='contact_form_text mt-5'>
                                        <textarea className='text_field contact_form_message'
                                            name='message'
                                           value={userData.message}
                                           onChange={inputHandler}
                                            placeholder='Message' cols='30' rows='10'></textarea>
                                    </div>

                                    <div className='contact_form_button'>
                                        <button type='submit' className='button contact_submit_button'
                                        onClick={postData}>Send Message</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                     </div>
                 </div>   
            </div>
        </div>
    )
};

export default Contact;