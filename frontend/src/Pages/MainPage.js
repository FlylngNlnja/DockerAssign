import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
    const navigate = useNavigate();
    const [MainContent, setMainContent] = useState(null);
    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate("/")
            return;
        }
    }, []);

    return (
        <div id="loginform">
            <div>
                <form>
                    <h1>Video Streaming</h1>
                    <div>
                        <button onClick={() => navigate('/VideoPage')}>Watch Video</button>
                    </div>
                    <div>
                        <button onClick={() => {
                            sessionStorage.removeItem('token');
                            navigate('/');
                        }}>Logout</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MainPage;
