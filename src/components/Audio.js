import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';
import Cookies from 'js-cookie';
import NewAudio from './NewAudio';
import logo from '../images/GCC-TBC.png';

function AudioPlayerMain() {
  const audioRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifKey, setGifKey] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const [countdown, setCountdown] = useState(10); // Set countdown to 2 minutes (120 seconds)

  const fetchData = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const response = await fetch(`http://43.204.237.196:5000/api/audio/${user_id}`);
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
  
  const fetchData1 = async () => {
    try {
      const user_id = Cookies.get('user_id');
      const response = await fetch(`http://43.204.237.196:5000/api/audio/${user_id}`);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        const audioLink = data.link;
        audioRef.current.src = audioLink;
  
        // Fetch last_played_position
        const userResponse = await fetch(`http://43.204.237.196:5000/api/exuser2/${user_id}`);
        const userData = await userResponse.json();
        const lastPlayedPositionPercentage = userData.last_played_position;
  
        if (lastPlayedPositionPercentage < 97) { // If less than 97% of the audio was played
          const resumeTime = audioRef.current.duration * (lastPlayedPositionPercentage / 100); // Calculate the time to resume
          audioRef.current.currentTime = resumeTime; // Set the current time of the audio
        }
      } else {
        console.error('Failed to fetch audio link:', response.status);
      }
    } catch (error) {
      console.error('Error fetching audio link:', error);
    }
  };

  const handleLoadedMetadata = async () => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      // Set currentTime to last_played_position
      const user_id = Cookies.get('user_id');

      try {
        // Fetch last_played_position
        const userResponse = await fetch(`http://43.204.237.196:5000/api/exuser2/${user_id}`);
        const userData = await userResponse.json();
        const lastPlayedPositionPercentage = userData.last_played_position;

        if (lastPlayedPositionPercentage < 97) { // If less than 97% of the audio was played
          const resumeTime = audioRef.current.duration * (lastPlayedPositionPercentage / 100); // Calculate the time to resume
          audioRef.current.currentTime = resumeTime; // Set the current time of the audio
        }
         else {
          // If greater than or equal to 97, start the countdown
          setCountdown(10); // Reset countdown to 10 seconds or your desired value
          setIsPlaying(true);
          // Start playing
          setAudioEnded(true);  // Start playing
        }
      
      } catch (error) {
        console.error('Error fetching last played position:', error);
      }
    }
};

  const handleAudioEnd = () => {
    console.log('Audio ended');
    setAudioEnded(true);
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    // Log the percentage of audio played until the interruption
    const audio = audioRef.current;
   
    const interruptedPercentage = !isNaN(audio.currentTime)
    ? Math.floor((100 / audio.duration) * audio.currentTime)
    : 0;

  console.log(`Audio playback interrupted at ${interruptedPercentage}%`);
  };

  const updateStatus = async () => {
    const user_id = Cookies.get('user_id');
    console.log("status updated")
    try {
      const response = await fetch(`http://43.204.237.196:5000/api/exuser/${user_id}`, {
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

  const updateLastPlayedPosition = async (percentage) => {
    const user_id = Cookies.get('user_id');
    try {
      const response = await fetch(`http://43.204.237.196:5000/api/exuser1/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_played_position: percentage }),
      });

      if (!response.ok) {
        console.error('Failed to update last played position:', response.status);
      }
    } catch (error) {
      console.error('Error updating last played position:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchData1();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgressBar = () => {
      const currentPercentage = Math.floor((100 / audio.duration) * audio.currentTime);
      setPercentage(currentPercentage);
      if (!isNaN(currentPercentage)) {
        updateLastPlayedPosition(currentPercentage);
      }
    };

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleAudioError); // Listen for the error event
    audio.addEventListener('loadedmetadata', handleLoadedMetadata); // Listen for the loadedmetadata event

    return () => {
      audio.removeEventListener('timeupdate', updateProgressBar);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata); // Remove the loadedmetadata event listener
    };
}, []);

  useEffect(() => {
    let countdownInterval;
    if (audioEnded && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(countdownInterval);
    }
    return () => clearInterval(countdownInterval);
  }, [audioEnded, countdown]);

  if (countdown === 0) {
    return <NewAudio />; // Render NewAudio component when countdown ends
  }

  return (
    <div className="container">
      {audioEnded &&
        <div className="overlay">
          <div className="countdown">Next Audio in : {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' + countdown % 60 : countdown % 60}</div>
        </div>
      }
      
      
    <div className="title-bar">
      
      
        <h1>Audio Sessio Passage1</h1>
    </div>
    
    <div className="student-info">
        <div className="student-photo">
            {/* Student photo here */}
        </div>
        <div className="student-details">
            <p className="student-name">Student's Name</p>
        </div>
    </div>
    <div className="instruction">
        <p>This is Your Exam Audio. Listen carefully and note down the shorthand figures you can hear from the Audio. Remember, you cannot pause, rewind and start the audio again once you click on the play button.</p>
    </div>

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
        {isPlaying && !audioEnded && <img key={gifKey} id="visualizer" src={visualGif} alt="Audio visualizer" />}
      </div>
    </div>
  );
}

export default AudioPlayerMain;
