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
                {MainContent}
            </div>
        </div>
    );
};

export default MainPage;
