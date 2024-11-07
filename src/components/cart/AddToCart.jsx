import React, { useState } from 'react';
import axios from 'axios';

const CART_ENDPOINT = 'https://ecommerce-node4.onrender.com/cart';

export default function AddToCart({ productId }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const isProductInCart = async () => {
        const token = localStorage.getItem('userToken');
        if (!token) return false;

        try {
            const { data } = await axios.get(CART_ENDPOINT, {
                headers: { authorization: `Tariq__${token}` },
            });
            return data.cart.some(item => item.productId === productId);
        } catch (err) {
            console.error('Error checking cart:', err);
            return false;
        }
    };

    const addToCart = async () => {
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('You need to log in to add products to the cart.');
                setLoading(false);
                return;
            }

            const inCart = await isProductInCart();
            if (inCart) {
                setError('You’ve already added this product to your cart.');
                alert('Prodcut is already in cart')
                setLoading(false);
                return;
            }

            await axios.post(
                CART_ENDPOINT,
                { productId, quantity: 1 },
                { headers: { authorization: `Tariq__${token}` } }
            );

            setMessage('Product added to cart!');
            window.location.reload();

        } catch (err) {
            console.error('Error adding product to cart:', err);
            setError('Prodcut is already in cart.');
        } finally {
            setLoading(false);

        }
    };

    return (
        <div>
            <button
                onClick={addToCart}
                className="mt-4 bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Add to Cart'}
            </button>
            {message && <p className="mt-2 text-green-500">{message}</p>}
            {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
    );
}
