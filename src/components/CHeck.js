import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';

function AudioPlayer() {
    const audioRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gifKey, setGifKey] = useState(0); // new state for controlling gif reload

    useEffect(() => {
        const audio = audioRef.current;
        const updateProgressBar = () => {
            setPercentage(Math.floor((100 / audio.duration) * audio.currentTime));
        };

        audio.addEventListener('timeupdate', updateProgressBar);

        return () => {
            audio.removeEventListener('timeupdate', updateProgressBar);
        };
    }, []);

    const startPlaying = () => {
        if (!audioRef.current.paused) {
            return;
        }
        audioRef.current.play();
        setIsPlaying(true);
        setGifKey(prevKey => prevKey + 1); // increment key to force gif reload
    };
    return (
        <div className="container">
            <div className="title-bar">
                <h1>Audio Session</h1>
            </div>
            <div className="student-info">
                <div className="student-photo">
                    {/* Student photo here */}
                </div>
                <div className="student-details">
                    <p className="time-left">Time Left: 29:12</p>
                    <p className="student-name">Student's Name</p>
                </div>
            </div>
            <div className="instruction">
                <p>This is Your Exam Audio. Listen carefully and note down the shorthand figures you can hear from the Audio. Remember, you cannot pause, rewind and start the audio again once you click on the play button.</p>
            </div>        
            <div className="audio-player">
                <audio id="audio" ref={audioRef} src="https://drive.google.com/uc?export=download&id=1K5ehNlXbR5JIFlxsKRoXQadct10J-YFy" preload="metadata"></audio>
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