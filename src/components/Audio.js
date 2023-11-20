import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';
import Cookies from 'js-cookie';

function AudioPlayer() {
  const audioRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifKey, setGifKey] = useState(0);

  const handleAudioEnd = () => {
    alert('Audio has ended');
  };

  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const response = await fetch(`http://localhost:5000/api/audio/${user_id}`);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        const audioLink = data.link;
        audioRef.current.src = audioLink;
      } else {
        console.error('Failed to fetch audio link:', response.status);
      }
    } catch (error) {
      console.error('Error fetching audio link:', error);
    }
  };

  const handleLoadedMetadata = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgressBar = () => {
      setPercentage(Math.floor((100 / audio.duration) * audio.currentTime));
    };

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgressBar);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  const updateStatus = async () => {
    const user_id = Cookies.get('user_id');
    console.log("status updated")
    try {
      const response = await fetch(`http://localhost:5000/api/exuser/${user_id}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        console.error('Failed to update status:', response.status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const startPlaying = () => {
    if (!audioRef.current.paused) {
      return;
    }
    audioRef.current.play();
    setIsPlaying(true);
    setGifKey(prevKey => prevKey + 1);
    updateStatus();
  };

  return (
    <div className="container">
      <div className="audio-player">
        <audio id="audio" ref={audioRef} src="" preload="metadata"></audio>

        <div className="audio-controls">
          <div id="play-pause" className="play" onClick={startPlaying}>
            {isPlaying ? '⏸️' : '▶️'}
          </div>
          <div className="audio-progress">
            <progress id="progress-bar" max="100" value={percentage}></progress>
            <div id="percentage">{percentage}%</div>
          </div>
        </div>
        {isPlaying && <img key={gifKey} id="visualizer" src={visualGif} alt="Audio visualizer" />}
      </div>
    </div>
  );
}

export default AudioPlayer;