import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';
import Cookies from 'js-cookie';
import Congratulations from './NewAudio';

function AudioPlayer() {
  const audioRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const [countdown, setCountdown] = useState(120); // Set countdown to 2 minutes (120 seconds)
  
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

  const handleAudioEnd = () => {
    setAudioEnded(true);
    alert('Audio has ended');
  };

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

  useEffect(() => {
    fetchData();
  }, []);

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

  useEffect(() => {
    let countdownInterval;
    if(audioEnded && countdown > 0) {
        countdownInterval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);
    } else if (countdown === 0) {
        clearInterval(countdownInterval);
    }
    return () => clearInterval(countdownInterval);
  }, [audioEnded, countdown]);

  if (countdown === 0) {
    return <Congratulations />; // Render Congratulations component when countdown ends
  }

  return (
    <div className="container">
      {audioEnded &&
          <div className="overlay">
            <div className="countdown">Next Audio in : {Math.floor(countdown/60)}:{countdown%60 < 10 ? '0'+countdown%60 : countdown%60}</div>
          </div>
      }
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