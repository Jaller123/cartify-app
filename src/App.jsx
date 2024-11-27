import { useState, useEffect } from 'react'
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
  
    const handleLoginSuccess = () => {
      navigate('/homepage'); // Navigate to homepage after successful login
    };

    const handleCreateAccount = () => {
      navigate('/')
    }
  
    return <Login onLoginSuccess={handleLoginSuccess} onCreateAccount={handleCreateAccount}/>;
  };
  
  const HomePageWrapper = () => {
      const navigate = useNavigate()
      useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
          console.warn('No token found. Redirecting to login')
          navigate('/login')
        }
      }, [navigate])
      return <Homepage />
    }
   
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<RegisterWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/homepage" element={<HomePageWrapper />} />
      </Routes>
    </Router>
    </>
  )
}
export default App
