import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const MainPage = () => {
    const navigate = useNavigate();
    const [videoUrl, setVideoUrl] = useState(null);
    const [formData, setFormData] = useState({
        videoid: ''
    });
    const handleChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };
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
        const response = await fetch('http://localhost:3010/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.status === "200") {
                return fetch('http://localhost:3008/save-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({name: file.name, path: data.message })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Video metadata saved successfully'); // Add this line
                        return data;
                    });
            } else {
                throw new Error('Error uploading file');
            }

        })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    const RetrieveVideo = async (e) => {
        e.preventDefault();
        const pathResponse = await fetch('http://localhost:3007/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoID: formData.videoid })
        });
        if (!pathResponse.ok) {
            console.error('Error:', pathResponse.statusText);
            return;
        }
        const pathData = await pathResponse.json();
        const videoPath = pathData.path;

        // Then, get the video file
        const fileResponse = await fetch('http://localhost:3010/videos/retr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videopath: videoPath })
        });
        if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        } else {
            console.error('Error:', fileResponse.statusText);
        }
    }

    return (<>
                <form onSubmit={addtoService}>
                    <label>Upload Video</label>
                    <input type="file" name="file" id="file" />
                    <button type="submit" value="Upload" > Upload </button>
                </form>
                <form onSubmit={RetrieveVideo}>
                    <label>View Video with ID: </label>
                    <input type="text" name="id" id="id" onChange={(e) => handleChange('videoid', e.target.value)}/>
                    <button type="submit" value="View" > View </button>
                </form>
            {videoUrl && <video src={videoUrl} controls />}
        </>
    );
};

export default MainPage;
