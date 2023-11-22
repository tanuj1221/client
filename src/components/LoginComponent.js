import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CSVImport from './CSVImport';
import TableEditor from './TableEditor';
// import AudioPlayer from './Audio';
import ExamInformation from './Info'
// import Instructions from './Introduction';
import '../style.css'
import logo from '../images/GCC-TBC.png';
import DeleteUserDataButton from './Delete'


const LoginComponent = () => {
  const [user_id, setUser_id] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [render, setRender] = useState(false); // initialize a dummy state

  const forceUpdate = () => setRender(!render); // toggle the state to force render

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
      const response = await axios.post('http://43.204.237.196:5000/api/login', { user_id, password });
      const authToken = response.data.token;
      const userRole = response.data.role;
      const userIdFromServer = response.data.user_id;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('user_id', userIdFromServer);
  
      Cookies.set('authToken', authToken, { expires: 1, path: '/' });
      Cookies.set('userRole', userRole, { expires: 1, path: '/' });
      Cookies.set('user_id', userIdFromServer, { expires: 1, path: '/' });
  
      // Wait for states to update
      await Promise.all([setToken(authToken), setRole(userRole)]);
  
      // setUser_id('');
      // setPassword('');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };
  
  const handleLogout = async () => {
    try {
      const user_id = Cookies.get('user_id');
      // const user_id = Cookies.get('user_id');
      // Make a call to the logout endpoint on the server
      await axios.post('http://43.204.237.196:5000/api/logout', { user_id });
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user_id');
      
  
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
          {role === 'user' && (
            <div>
            <h3>User Add</h3>
        
            <ExamInformation />
          </div>
            
          )}
          {role === 'admin' && (
            <div>
              <h3>CSV Import</h3>
              <CSVImport />
            </div>
          )}
          {role === 'superadmin' && (
            
            <div>
            <h3>CSV Import</h3>
            <CSVImport />
            <h3>Table Editor</h3>
            <TableEditor />
            <h3>User Add</h3>
            <DeleteUserDataButton />
            
          </div>
          )}
        </div>
      ) : (
        <div>
          <div className="box">
            <span className="borderLine"></span>
            <form>
              <img className="logo" src={logo} alt="Logo" />
              <h2>Sign In</h2>
              <div className="inputBox">
                <input type="text" required="required" value={user_id} onChange={(e) => setUser_id(e.target.value)} />
                <span>Username</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span>Password</span>
                <i></i>
              </div>
              <div className="links">
                {/* <a >Having Trouble?</a>
                <a>Contact Administrator</a> */}
              </div>
              <input type="submit" value="Login" onClick={handleLogin} />
            </form>
          </div>
          <div className="copyright">
            &copy; 2023
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginComponent;
