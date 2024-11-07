import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.error('User is not logged in.');
        return;
      }

      // Fetch cart data
      const { data } = await axios.get(
        'https://ecommerce-node4.onrender.com/cart',
        {
          headers: {
            authorization: `Tariq__${token}`,
          }
        }
      );

      console.log('cart:', data);

      // Set the cart count from the `count` field in the response
      setCartCount(data?.count || 0);

    } catch (error) {
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  // Navigation handlers
  const handleCartClick = () => navigate('/cart');
  const handleHomeClick = () => navigate('/');
  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');
  const handleOrdersClick = () => navigate('/orders');

  return (
    <nav className="navbar fixed top-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-10 py-4 z-50">
      <div className="logo text-xl font-semibold text-gray-800 cursor-pointer" onClick={handleHomeClick}>
        Home
      </div>
      <div className="flex items-center space-x-6">
        <button className="text-gray-600 hover:text-gray-800 transition" onClick={handleHomeClick}>
          Products
        </button>
        <button className="text-gray-600 hover:text-gray-800 transition" onClick={handleRegisterClick}>
          Register
        </button>
        {
          localStorage.getItem('userToken') ? (
            <button className="text-gray-600 hover:text-gray-800 transition" onClick={logoutUser}>
              Logout
            </button>
          ) : (
            <button className="text-gray-600 hover:text-gray-800 transition" onClick={handleLoginClick}>
              Login
            </button>
          )
        }
        <button className="text-gray-600 hover:text-gray-800 transition" onClick={handleOrdersClick}>
          Orders
        </button>
        <div className="relative cursor-pointer" onClick={handleCartClick}>
          <img src="/cart-icon.png" alt="Cart" className="w-8 h-8" />
          <span className="cart-count absolute -top-1 -right-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
            {cartCount}
          </span>
        </div>
      </div>
    </nav>
  );
}
