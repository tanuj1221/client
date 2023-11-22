import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CSVImport from './CSVImport';
import TableEditor from './TableEditor';
import AudioPlayer from './Audio';


const LoginComponent = () => {
  const [user_id, setUser_id] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    const userRole = Cookies.get('userRole');
    if (authToken) {
      setToken(authToken);
      setRole(userRole);
    }
  }, []);
  
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { user_id, password });
      const authToken = response.data.token;
      const userRole = response.data.role
      const userIdFromServer = response.data.user_id;;
  
      Cookies.set('authToken', authToken, { expires: 1, path: '/' });
      Cookies.set('userRole', userRole, { expires: 1, path: '/' });
      Cookies.set('user_id', userIdFromServer, { expires: 1, path: '/' });
      
  
      setToken(authToken);
      setRole(userRole);
      
      setUser_id('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };
  
  const handleLogout = async () => {
    try {
      const user_id = Cookies.get('user_id');
      // const user_id = Cookies.get('user_id');
      // Make a call to the logout endpoint on the server
      await axios.post('http://localhost:5000/api/logout', { user_id });
      
      
  
      // Remove the cookies and clear the state
      Cookies.remove('authToken');
      Cookies.remove('userRole');
      setToken('');
      setRole('');
      
      
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      {token ? (
        <div>
          <h2>User Management</h2>
          <button onClick={handleLogout}>Logout</button>
          {role === 'superadmin' && (
            <div>
              <h3>CSV Import</h3>
              <CSVImport />
              <h3>Table Editor</h3>
              <TableEditor />
              <h3>User Add</h3>
              <AudioPlayer />
            </div>
          )}
          {role === 'admin' && (
            <div>
              <h3>CSV Import</h3>
              <CSVImport />
            </div>
          )}
          {role === 'user' && (
            <div>
              <h3>User Add</h3>
              <AudioPlayer />
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <div>
            <label htmlFor="user_id">User ID:</label>
            <input type="text" id="user_id" value={user_id} onChange={(e) => setUser_id(e.target.value)} />
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
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
