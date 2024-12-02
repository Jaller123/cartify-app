import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Register, Login, Homepage, Contact, About, CheckOut, OrderSuccess } from 'cartify-frontend';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [cart, setCart] = useState(() => 
  {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [username, setUsername] = useState('Guest');
  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);
  

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
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
  
    const handleLogout = () => {
      localStorage.removeItem("token"); // Clear the token
      localStorage.removeItem("cart"); // Clear the cart
      setUsername("Guest"); // Reset username state
      navigate("/login"); // Navigate to login page
    };
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/login");
      else decodeToken();
    }, [navigate]);
  
    return (
      <Homepage
        username={username}
        addToCart={addToCart}
        onLogout={handleLogout} // Pass the logout handler
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
    return <About username={username} />;
  };

  const ContactPageWrapper = () => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) navigate('/login');
      else decodeToken();
    }, [navigate]);
    return <Contact username={username} />;
  };

  const CheckoutPageWrapper = () => {
    const navigate = useNavigate();

    const handleCompleteOrder = () => {
      localStorage.removeItem('cart')
      console.log("Order completed. Navigating to order complete page...");
      navigate('/order-complete');
    }
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); 
      } else {
        decodeToken(); 
      }
    }, [navigate]);
  
    return (
      <CheckOut
        username={username}
        products={cart}
        removeFromCart={removeFromCart}
        onCompleteOrder={handleCompleteOrder}
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
  );
}

export default App;
