import React from 'react';
import  { useState } from 'react';

const DeleteUserDataButton = () => {
  const [userId, setUserId] = useState('');
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleDeleteClick1 = async () => {
    try {
      const response = await fetch(`http://65.1.107.69:5000/delete-user-data/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers you need, such as authorization headers
        },
      });

      if (response.ok) {
        console.log(`Deletion successful for user with ID ${userId}`);
      } else {
        console.error('Deletion failed');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const response = await fetch('http://65.1.107.69:5000/delete-all-user-data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers you need, such as authorization headers
        },
      });

      if (response.ok) {
        console.log('Deletion successful for all users');
      } else {
        console.error('Deletion failed');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const handleDeleteClick2 = async () => {
    try {
      const response = await fetch('http://65.1.107.69:5000/delete-all-user-percent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers you need, such as authorization headers
        },
      });

      if (response.ok) {
        console.log('reseted value of suido successful for all users');
      } else {
        console.error('Deletion failed');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  return (
    <div className="user-data-container">
      <button onClick={handleDeleteClick}>Delete Data for All Users</button>

      <button onClick={handleDeleteClick2}>Reset Audio Values</button>

      <label>
        User ID:
        <input type="text" value={userId} onChange={handleUserIdChange} />
      </label>
      
      <button onClick={handleDeleteClick1}>Delete Data for User</button>
    </div>
  );
};

export default DeleteUserDataButton;
