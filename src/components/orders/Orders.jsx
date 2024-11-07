import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setMessage('You need to log in to view your orders.');
                return;
            }

            const { data } = await axios.get(
                'https://ecommerce-node4.onrender.com/order',
                {
                    headers: { authorization: `Tariq__${token}` },
                }
            );

            setOrders(data.orders); // Properly extract the orders array from the response
        } catch (error) {
            console.error('Error fetching orders:', error.response || error.message);
            setMessage('Failed to load your orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Your  Orders</h1>
                {loading ? (
                    <p className="text-center text-gray-500">Loading orders...</p>
                ) : message ? (
                    <p className="text-center text-red-500">{message}</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">You have no active orders.</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <ul>
                            {orders.map((order, index) => (
                                <li key={index} className="border-b py-4 last:border-none">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-medium text-gray-700">Order ID: {order._id}</p>
                                            <p className="text-sm text-gray-500 capitalize">Status: <span className={`${order.status == 'cancelled' ? 'text-red-800' : 'text-blue-800 '}`} >{order.status}</span> </p>
                                            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Total: ${order.finalPrice}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
