import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const VideoPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate("/")
             // Ensure function exits if token is not present
        }
    }, []);
return(<div className="flex w-[100%] justify-content-center" style={{justifyContent:"center"}}>

</div>);
};

export default VideoPage;