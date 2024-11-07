import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setMessage(''); // Clear previous messages
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('You need to log in to place an order.');
        setLoading(false);
        return;
      }

      const orderData = {
        couponName: coupon || null,  // Optional field
        address,
        phone
      };

      // Make the API call to place the order
      const { data } = await axios.post(
        'https://ecommerce-node4.onrender.com/order',
        orderData,
        { headers: { authorization: `Tariq__${token}` } }
      );

      setMessage('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 3000); // Navigate to home or another page after successful order
    } catch (error) {
      console.error('Error placing order:', error.response || error.message);
      setMessage('Failed to place the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Checkout</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Delivery Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="coupon" className="block text-gray-700 font-medium mb-2">Coupon Code (Optional)</label>
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter a coupon code (if any)"
            />
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </div>
      </div>
    </div>
  );
}
