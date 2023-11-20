import React, { useEffect, useRef, useState } from "react";
import '../audio-module.css';
import visualGif from '../images/visual.gif';
import Cookies from 'js-cookie';

function AudioPlayer() {
    const audioRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gifKey, setGifKey] = useState(0); // new state for controlling gif reload

    const handleAudioEnd = () => {
        alert('Audio has ended');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user_id = Cookies.get('user_id');
                const response = await fetch(`http://localhost:5000/api/audio/${user_id}`);
                console.log(response); // Log the entire response
                if (response.ok) {
                    const data = await response.json();
                    const audioLink = data.link;

                    // Set the audio source dynamically
                    audioRef.current.src = audioLink;
                } else {
                    console.error('Failed to fetch audio link:', response.status);
                }
            } catch (error) {
                console.error('Error fetching audio link:', error);
            }
        };

        const handleLoadedMetadata = () => {
            // Audio metadata has loaded, now you can play the audio
            if (isPlaying) {
                audioRef.current.play();
            }
        };

        fetchData();

        // Event listener for loadedmetadata
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

    // New function for updating status
    const updateStatus = async () => {
        const user_id = Cookies.get('user_id');
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
        setGifKey(prevKey => prevKey + 1); // increment key to force gif reload

        // Update status when play button is clicked
        updateStatus();
    };

    return (
        <div className="container">
            {/* snip */}
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