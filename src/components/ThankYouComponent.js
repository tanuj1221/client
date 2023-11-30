import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../ThankYou.css';


const ThankYouComponent = () => {

  const handleLogout = async () => {
    try {
      const user_id = Cookies.get('user_id');
      await axios.post('http://65.1.107.69:5000/api/logout', { user_id });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user_id');
      
      // Remove the cookies
      Cookies.remove('authToken');
      Cookies.remove('userRole');
      Cookies.remove('user_id');
      
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className='logout-container'>
      <button onClick={handleLogout}>Logout</button>
      <h2>Thank You</h2>
      <p>Your exam is finished. Good job!</p>
    </div>
  );
};

export default ThankYouComponent;