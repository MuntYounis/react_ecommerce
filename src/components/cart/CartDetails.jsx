
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function CartDetails() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCartDetails();
  }, []);

  const getCartDetails = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.error('User is not logged in.');
        return;
      }

      console.log("Token:", token);

      // Fetch cart data
      const { data } = await axios.get(
        'https://ecommerce-node4.onrender.com/cart',
        {
          headers: {
            authorization: `Tariq__${token}`,
          }
        }
      );

      // Update cart items with the products array
      setCartItems(data?.products || []);

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

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.error('User is not logged in.');
        alert('You need to log in to clear your cart.');
        navigate('/login');
        return;
      }

      console.log("Token:", token);

      // Clear cart
      const { data } = await axios.patch(
        'https://ecommerce-node4.onrender.com/cart/clear',
        {},
        {
          headers: {
            authorization: `Tariq__${token}`,
          }
        }
      );

      console.log('Clear cart response:', data);

      // Clear cart items from the state
      setCartItems([]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Cart is empty.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="mb-4 border-b pb-4 last:border-none">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Product image */}
                      <img
                        src={item.details?.mainImage?.secure_url || '/placeholder-image.png'}
                        alt={item.details?.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="text-lg font-medium text-gray-700">{item.details?.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 font-medium">${item.details?.finalPrice}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Summary Section */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-500 transition ease-in-out duration-150"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <button
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-500 transition ease-in-out duration-150"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}