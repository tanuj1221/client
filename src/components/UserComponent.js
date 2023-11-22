import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://43.204.237.196:5000/api/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await axios.post('http://43.204.237.196:5000/api/users', { role, password });
      setRole('');
      setPassword('');
      window.location.reload(); // Refresh the user list after adding a new user
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <div>
        <label htmlFor="role">Role:</label>
        <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleAddUser}>Add User</button>
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>{`ID: ${user.user_id}, Role: ${user.role}, Password: ${user.password}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserComponent;
