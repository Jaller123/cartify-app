import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Register, Login, Homepage } from 'cartify-frontend';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState('Guest');

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);
        setUsername(decoded.username || 'Guest'); // Extract the username
      } catch (error) {
        console.error('Error decoding token:', error);
        setUsername('Guest');
      }
    }
  };
  

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
      const token = localStorage.getItem('token');
      if (token) decodeToken();
      navigate('/homepage');
    };

    const handleCreateAccount = () => {
      navigate('/');
    };

    return <Login onLoginSuccess={handleLoginSuccess} onCreateAccount={handleCreateAccount} />;
  };

  const HomePageWrapper = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found. Redirecting to login');
        navigate('/login');
      } else {
        decodeToken();
      }
    }, [navigate]);
  
    return <Homepage username={username} />;
  };
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/homepage" element={<HomePageWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
