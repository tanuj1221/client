import React, { useState, useEffect } from 'react';
import '../instructions.css'; 
import AudioPlayer from './TestAudio'; // Replace this with the actual component
import Cookies from 'js-cookie';
import logo from '../images/GCC-TBC.png';

const Instructions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showNextComponent, setShowNextComponent] = useState(false);
  const [examInfo, setExamInfo] = useState();

  
  useEffect(() => {
    const UserId =  Cookies.get('user_id'); // replace 'your_user_id' with the actual UserId
    fetch(`http://43.204.237.196:5000/api/intro1/${UserId}`)
      .then(response => response.json())
      .then(data => {
        setExamInfo(data);
        if (data === 'yes') {
          setShowNextComponent(true);
        }
      })
      .catch(error => console.error('Error:', error));
    }, []);
      

  const handleProceed = async () => {
    if (isChecked) {
      setShowNextComponent(true);
      try {
        const UserId =  Cookies.get('user_id');
        const now = new Date();
        const dateTime = now.toLocaleString(); // Convert to local date/time string
        const logInfo = {
          user_id: UserId,
          information: `Proceed button clicked at ${dateTime}`
        };
        await fetch(`http://43.204.237.196:5000/api/introlog`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logInfo)
        });
       
      } catch (error) {
        console.error('Error:', error);
      }
      
    } else {
      alert('Please confirm that the information is correct.');
    }
  };

  return (
    <div>
      {showNextComponent ? (
        <AudioPlayer />
      ) : (
        <div>
          <div className="title-bar">
            <div className="info-title">
              <img src={logo} alt="GCC-TBC" />
            </div>
            <h1>MSCE Pune Online Exam</h1>
          </div>
          <div className="container">
            <div className="information">Instructions</div>
            <div className="info-container">
              <div className="info-left">
              <p>परीक्षा एकूण ३ टप्पयात होईल 
                    १. टेस्ट ऑडीयो
                    २. Passage A
                    ३. Passage B</p>
                <p>टप्पा  १ : टेस्ट ऑडीयो टेस्ट
                    ऑडीयो गरजेनुसार अनेक वेळा
                    ऐकता येईल. स्पीकर चा आवाज
                    व्यवस्थित सर्व  वर्गात  येत आहे 
                    याची खात्री करावी नसल्यास
                    आवाज वाढवून / इतर स्पीकर..</p>
                <p>
                    Audio start Automatically
                    Do no press anything during
                    this process
                    आवाज सुरू होईल. पूर्ण होईपर्यंत इतर काही करू नये 
                </p>
                <p>
                    Audio is 100% completed Select “ok”
                    Audio 100% पूर्ण झाली आहे "ok" करावे 
                </p>
              </div>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="info-check"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="info-check">I have read and understood above instructions.</label>
            </div>
            <div className="button-container">
              <button className="proceed-button" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
          <div className="copyright">&copy; 2023</div>
        </div>
      )}
    </div>
  );
};

export default Instructions;