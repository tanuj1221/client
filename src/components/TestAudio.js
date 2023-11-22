import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';
import Cookies from 'js-cookie';
import AudioPlayerMain from './Audio'; // Adjust the path as needed

function AudioPlayer() {
    const audioRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [showAudioPlayerMain, setShowAudioPlayerMain] = useState(false);
    

    useEffect(() => {
        const UserId =  Cookies.get('user_id'); // replace 'your_user_id' with the actual UserId
        fetch(`http://43.204.237.196:5000/api/testaudio1/${UserId}`)
          .then(response => response.json())
          .then(data => {
           
            if (data === 'yes') {
                setShowAudioPlayerMain(true);
            }
          })
          .catch(error => console.error('Error:', error));
        }, []);
          
    

    useEffect(() => {
        const audio = audioRef.current;

        const updateProgressBar = () => {
            setPercentage(Math.floor((100 / audio.duration) * audio.currentTime));
        };

        const handleAudioEnd = () => {
            setIsPlaying(false);
            setShowMessageBox(true);
        };

        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('ended', handleAudioEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateProgressBar);
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, []);

    const startPlaying = () => {
        if (!audioRef.current.paused) {
            return;
        }
        audioRef.current.play();
        setIsPlaying(true);
        setShowMessageBox(false);
    };

    const handleMessageBoxResponse = async (response) => {
        console.log(`User responded: ${response}`);

        if (response === 'yes') {
            setShowMessageBox(false);
            setShowAudioPlayerMain(true);
            try {
                const UserId =  Cookies.get('user_id');
                const now = new Date();
                const dateTime = now.toLocaleString(); // Convert to local date/time string
                const logInfo = {
                  user_id: UserId,
                  information: `Proceed button clicked at ${dateTime}`
                };
                await fetch(`http://43.204.237.196:5000/api/testaudio`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(logInfo)
                });
               
              } catch (error) {
                console.error('Error:', error);
              }
              
        } else if (response === 'no') {
            const audio = audioRef.current;
            audio.currentTime = 0;
            audio.play();
            setShowMessageBox(false);
        }
    };

    return (
        <div className="container">
            {showAudioPlayerMain ? (
                <AudioPlayerMain />
            ) : (
                showMessageBox ? (
                    <div className="message-box">
                        <p>Did you hear that audio?</p>
                        <div className="message-box-options">
                            <button onClick={() => handleMessageBoxResponse('yes')}>Yes</button>
                            <button onClick={() => handleMessageBoxResponse('no')}>No</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="title-bar">
                            <h1>Audio Session</h1>
                        </div>
                        {/* ... (other components and JSX) */}
                        <div className="audio-player">
                            <audio id="audio" ref={audioRef} src="https://drive.google.com/uc?export=download&id=17jWyMDuaoqkX7tL6jT7W-takrGetEwjr" preload="metadata"></audio>
                            <div className="audio-controls">
                                <div id="play-pause" className="play" onClick={startPlaying}>
                                    {isPlaying ? '⏸️' : '▶️'}
                                </div>
                                <div className="audio-progress">
                                    <progress id="progress-bar" max="100" value={percentage}></progress>
                                    <div id="percentage">{percentage}%</div>
                                </div>
                            </div>
                            {isPlaying && <img key={visualGif} id="visualizer" src={visualGif} alt="Audio visualizer" />}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default AudioPlayer;
