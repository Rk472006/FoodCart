import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'; // Custom CSS file

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className='home-page'>
      <div className="home-container">
        <h1 className="title">🍔 FoodCart 🍕</h1>
        <div className="button-group">
          <button className="btn login-button" onClick={handleLogin}>Login</button>
          <button className="btn register-button" onClick={handleRegister}>Register</button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Home;
