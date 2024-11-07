import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(null); 

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setMessage('You need to log in to view the orders.');
                return;
            }

            const { data } = await axios.get(
                'https://ecommerce-node4.onrender.com/order',
                { headers: { authorization: `Tariq__${token}` } }
            );

            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error.response || error.message);
            setMessage('Failed to load the orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const approveAllOrders = async () => {
        setApproveLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setMessage('You need to log in to approve orders.');
                return;
            }

            const { data } = await axios.patch(
                `https://ecommerce-node4.onrender.com/order/approveAll`,
                {},
                { headers: { authorization: `Tariq__${token}` } }
            );

            setMessage('All orders have been approved successfully.');
            fetchOrders(); // Refresh orders after approving all
        } catch (error) {
            console.error('Error approving all orders:', error.response || error.message);
            setMessage('Failed to approve all orders. Please try again.');
        } finally {
            setApproveLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        setCancelLoading(orderId); // Track loading state for the specific order being canceled
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setMessage('You need to log in to cancel orders.');
                return;
            }

            await axios.patch(
                `https://ecommerce-node4.onrender.com/order/cancel/${orderId}`,
                {},
                { headers: { authorization: `Tariq__${token}` } }
            );

            setMessage('Order has been canceled successfully.');
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
        } catch (error) {
            console.error('Error canceling order:', error.response || error.message);
            setMessage('Failed to cancel the order. Please try again.');
        } finally {
            setCancelLoading(null); 
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Admin Orders</h1>
                {loading ? (
                    <p className="text-center text-gray-500">Loading orders...</p>
                ) : message ? (
                    <p className="text-center text-red-500">{message}</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-gray-500">No active orders found.</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <button
                            className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-500 transition ease-in-out duration-150 mb-4"
                            onClick={approveAllOrders}
                            disabled={approveLoading}
                        >
                            {approveLoading ? 'Approving All...' : 'Approve All Orders'}
                        </button>
                        <ul>
                            {orders.map((order) => (
                                <li key={order._id} className="border-b py-4 last:border-none">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-medium text-gray-700">Order ID: {order._id}</p>
                                            <p className="text-sm text-gray-500 capitalize">
                                                Status: <span className={`${order.status === 'cancelled' ? 'text-red-800' : 'text-blue-800'}`}>{order.status}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Total: ${order.finalPrice}</p>
                                        </div>
                                        <div className="space-x-4">
                                            <button
                                                className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-500 transition ease-in-out duration-150"
                                                onClick={() => cancelOrder(order._id)}
                                                disabled={cancelLoading === order._id}
                                            >
                                                {cancelLoading === order._id ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
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
