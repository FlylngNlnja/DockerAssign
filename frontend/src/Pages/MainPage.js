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

    const addtoService = async (e) => {
        e.preventDefault();
        const file = document.getElementById('file').files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://file-storage-service:3010/upload', {
            method: 'POST',
            headers: {
                'Authorization': sessionStorage.getItem('token')
            },
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.status === 200) {
                return fetch('http://upload_video:3008/save-video', {
                    method: 'POST',
                    headers: {
                        'Authorization': sessionStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: file.name, path: data.message })
                })
                    .then(response => response.json());
            } else {
                throw new Error('Error uploading file');
            }
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <div id="loginform">
            <div>
                <form onSubmit={addtoService}>
                    <label>File</label>
                    <input type="file" name="file" id="file" />
                    <button type="submit" value="Upload" > Upload </button>
                </form>
            </div>
        </div>
    );
};

export default MainPage;
