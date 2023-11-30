import React, { useState, useEffect } from 'react';
// import '../after-login.css'; 
import Instructions from './Introduction';
import Cookies from 'js-cookie';
import logo from '../images/GCC-TBC.png';


const ExamInformation = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [showNextComponent, setShowNextComponent] = useState(false);
  const [examInfo, setExamInfo] = useState(null); // Initialize with null for better conditional rendering
  const [loading, setLoading] = useState(true);
  const UserId = Cookies.get('user_id');

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        const response1 = await fetch(`http://65.1.107.69:5000/api/infolog1/${UserId}`);
        const data1 = await response1.json();

        if (data1.data === 'yes') {
          setShowNextComponent(true);
        }

        const response2 = await fetch(`http://65.1.107.69:5000/api/info/${UserId}`);
        const data2 = await response2.json();
        
        setExamInfo(data2);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
    }, [UserId]); // Add UserId to the dependency array

  const handleProceed = async () => {
    if (isChecked) {
      setShowNextComponent(true);
      try {
        const UserId = Cookies.get('user_id');
        const now = new Date();
        const dateTime = now.toLocaleString();
        const logInfo = {
          user_id: UserId,
          information: `Proceed button clicked at ${dateTime}`
        };
        await fetch(`http://65.1.107.69:5000/api/infolog`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      {showNextComponent ? (
        <Instructions />
      ) : 
      (
        <div>
          <div className="title-bar">
            <div className="info-title">
              <img src={logo} alt="GCC-TBC" />
            </div>
            <h1>
              MSCE Pune
              Online Exam
            </h1>
          </div>
          <div className="container">
            <div className="information">
              Information
            </div>
            <div className="info-container">
              <div className="info-left">
                <p>User ID: <span className="centre-code">{examInfo?.user.subject_code}</span></p>
                <p>Centre Code: <span className="centre-code">{examInfo?.user.center_code}</span></p>
                <p>Center Name: <span className="centre-name">{examInfo?.center.Center_name}</span></p>
                <p>Batch: <span className="batch">{examInfo?.user.batch_code}</span></p>
                <p>Subject: {examInfo?.schedule.subject_speed}</p>
                <p className="exam-date">Date: {examInfo?.schedule.batch_date}</p>
                <div className="exam-hours">
                  <p className="start-time">Batch Time: {examInfo?.schedule.batch_time}</p>
                </div>
              </div>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="info-check"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <label htmlFor="info-check">
                Above information is correct.<br />
                वरील माहिती योग्य आहे.
              </label>
            </div>
            <div className="button-container">
              <button className="proceed-button" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
          <div className="copyright">
            &copy; 2023
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInformation;