import { useState } from 'react'
import './App.css'
import { Register, Login, Homepage } from 'cartify-frontend';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {

  const RegisterWrapper = () => {
    const navigate = useNavigate();
  
    const handleAlreadyHaveAccount = () => {
      navigate('/login'); 
    };
  
    return <Register onAlreadyHaveAccount={handleAlreadyHaveAccount} />;
  };
  
  const LoginWrapper = () => {
    const navigate = useNavigate();
  
    const handleLogin = () => {
      navigate('/homepage'); // Navigate to homepage after successful login
    };
  
    return <Login onClick={handleLogin} />;
  };
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<RegisterWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/homepage" element={<Homepage />} />
      </Routes>
    </Router>
    </>
  )
}
export default App
