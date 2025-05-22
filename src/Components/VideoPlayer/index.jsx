import React from "react";
import "./style.css";


const VideoPlayer = ({ videoUrl }) => {
    const videoSrc = `http://localhost/Movie/backend/Video/${videoUrl}`;
  
    return (
      <div className="video-player-container">
        <video width="800" height="450" controls autoPlay src={videoSrc}>
          Trình duyệt không hỗ trợ thẻ video.
        </video>
      </div>
    );
  };
  

export default VideoPlayer;