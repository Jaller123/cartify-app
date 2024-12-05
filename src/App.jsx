import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { CartProvider, useCart } from './assets/context/CartContext';
import './App.css';
import { Register, Login, Homepage, Contact, About, CheckOut, OrderSuccess } from 'cartify-frontend';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState('Guest');

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('cart'); 
    setUsername('Guest');
  };

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);
        setUsername(decoded.username || 'Guest'); 
      } catch (error) {
        console.error('Error decoding token:', error);
        setUsername('Guest');
      }
    }
  };

  const RegisterWrapper = () => {
    const navigate = useNavigate();
    const handleAlreadyHaveAccount = () => navigate('/login');
    return <Register onAlreadyHaveAccount={handleAlreadyHaveAccount} />;
  };

  const LoginWrapper = () => {
    const navigate = useNavigate();
    const handleLoginSuccess = () => {
      decodeToken();
      navigate('/homepage');
    };
    const handleCreateAccount = () => navigate('/');
    return <Login onLoginSuccess={handleLoginSuccess} onCreateAccount={handleCreateAccount} />;
  };

  

  const HomepageWrapper = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
      else decodeToken();
    }, [navigate]);
  
    return (
      <Homepage
        username={username}
        onLogout={handleLogout} 
      />
    );
  };
  

  const AboutPageWrapper = () => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) navigate('/login');
      else decodeToken();
    }, [navigate]);
    return <About username={username} onLogout={handleLogout} />;
  };

  const ContactPageWrapper = () => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) navigate('/login');
      else decodeToken();
    }, [navigate]);
    return  <Contact username={username} onLogout={handleLogout} />
  };

  const CheckoutPageWrapper = () => {
    const navigate = useNavigate();
    const { setCart } = useCart(); 
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        decodeToken();
      }
    }, [navigate]);
  
    const onCompleteOrder = () => {
      localStorage.removeItem("cart"); 
      setCart([]); 
      navigate("/order-complete"); 
    };
  
    return (
      <CheckOut
        username={username}
        onLogout={handleLogout}
        onCompleteOrder={onCompleteOrder} 
      />
    );
  };
  
  
  
  const OrderCompleteWrapper = () => {
    const navigate = useNavigate();
  
    const handleReturnToHomepage = () => {
      localStorage.removeItem('cart'); 
      navigate('/homepage'); 
    };
  
    return <OrderSuccess username={username} onReturnToHomepage={handleReturnToHomepage} />;
  };
  
  

  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<RegisterWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/homepage" element={<HomepageWrapper />} />
        <Route path="/contact" element={<ContactPageWrapper />} />
        <Route path="/about" element={<AboutPageWrapper />} />
        <Route path="/checkout" element={<CheckoutPageWrapper />} />
        <Route path="/order-complete" element={<OrderCompleteWrapper />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
