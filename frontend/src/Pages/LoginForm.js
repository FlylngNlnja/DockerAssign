import React, {useEffect, useState} from 'react';
import { Col, Form, Row, Button } from 'react-bootstrap';
import  {useNavigate} from 'react-router-dom'
import $ from "jquery";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('token')) { navigate('/MainPage'); }
    }, []);
    const handleChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };
    $(document).ready(function() {
        $("#LoginAlert").hide();
    });
    function alert(to_display){
        let obj = $("#LoginAlert");
        obj.text(to_display);
        obj.show();
        window.scrollTo(0, 0);
        obj.delay(5000).fadeOut('slow');
    }
    function validation(){
        if(formData.username.length < 1){alert("Your Username and/or Password are/is incorrect!"); return false;}
        if(formData.password.length < 1){alert("Your Username and/or Password are/is incorrect!"); return false;}
        return true;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validation()){return;}
        const apiUrl = 'http://localhost:3011/login';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });


            if (response.ok) {

                let token = await response.text();
                sessionStorage.setItem('token', token);
                navigate('/');
                setFormData({
                    username: '',
                    password: ''
                });
                window.location.reload();
            } else {
                alert("Your Username and/or Password are/is incorrect!");
                console.error('Failed to submit form');
            }
        } catch (error) {
            alert("Your Username and/or Password are/is incorrect!");
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div id="loginform" className="w-full">
            <div className="">
                <div>
                    <h3 className= "text-center font-bold">LOGIN</h3>
                </div>
                <hr className="my-0" />
                <div>
                    <div className=' w-[100%] text-white bg-red-300 text-center' role='alert' id="LoginAlert" > Your username or Password is incorrect!</div>
                    <div className="flex justify-content-center" style={{justifyContent:"center"}}>
                        <div className="bg-gray-200 w-1/2 pt-5 rounded shadow-lg">
                            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                                <div className="grid grid-cols-2 mr-5 ml-5" id="username_login">
                                    <label>Username</label>
                                    <input
                                        className="rounded"
                                        type="text"
                                        placeholder="Enter your username"
                                        onChange={(e) => handleChange('username', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 mr-5 ml-5" id="password_login">
                                    <label>Password</label>
                                    <input
                                        className="rounded"
                                        type="password"
                                        placeholder="********"
                                        onChange={(e) => handleChange('password', e.target.value)}
                                    />
                                </div>
                                <Button variant="primary" type="submit" className="text-white rounded-br rounded-bl col-span-2 w-[100%] bg-green-300 mt-5">
                                    LOGIN
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
