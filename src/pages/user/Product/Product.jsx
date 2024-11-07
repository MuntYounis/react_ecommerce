import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://ecommerce-node4.onrender.com';
const CART_ENDPOINT = `${API_BASE_URL}/cart`;
const REVIEW_ENDPOINT = `${API_BASE_URL}/products`;

export default function Product() {
  const [product, setProduct] = useState({});
  const [productImages, setProductImages] = useState([]);
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false); // State to track if the user has reviewed

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/products/${productId}`);
      setProduct(data.product);
      setProductImages(data.product.subImages);
      setReviews(data.product.reviews || []);

      // Check if the user has already submitted a review for this specific product
      const token = localStorage.getItem('userToken');
      if (token) {
        const userReviews = data.product.reviews.filter(review => review.userId === token);
        setHasReviewed(userReviews.length > 0); // Set to true if the user has reviewed this product
      }
    } catch (err) {
      console.error('Error fetching product data:', err);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

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
        setLoading(false);
        return;
      }

      await axios.post(
        CART_ENDPOINT,
        { productId, quantity: 1 },
        { headers: { authorization: `Tariq__${token}` } }
      );

      setMessage('Product added to cart!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      console.error('Error adding product to cart:', err);
      setError('An error occurred while adding the product to your cart.');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async () => {
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('You need to log in to add a review.');
        return;
      }

      const { data } = await axios.post(
        `${REVIEW_ENDPOINT}/${productId}/review`,
        { comment, rating },
        { headers: { authorization: `Tariq__${token}` } }
      );

      // Update reviews state with the new review
      setReviews((prevReviews) => [
        ...prevReviews,
        { comment, rating, userId: data.userId }, // Assuming the API returns userId or similar
      ]);

      setMessage('Review added successfully!');
      setComment('');
      setRating(0);
      setHasReviewed(true); // Mark that the user has reviewed this product
    } catch (err) {
      console.error('Error adding review:', err);
      setError('An error occurred while adding your review.');
    }
  };

  return (
    <section className="container mx-auto py-10 px-4 max-w-5xl mt-20">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.mainImage?.secure_url}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          <div className="grid grid-cols-3 gap-4">
            {productImages.map((img) => (
              <img
                src={img.secure_url}
                alt={product.name}
                key={img.public_id}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-md mb-6 text-gray-600">{product.description}</p>
          <h3 className='text-xl font-semibold text-green-600 mt-4 mb-6'>Price: ${product.price}</h3>
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
      </div>

      {/* Conditionally render the review section */}
      {!hasReviewed ? (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          />
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Rating (1-5)"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            min="1"
            max="5"
          />
          <button
            onClick={addReview}
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit Review
          </button>
        </div>
      ) : (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Your Review</h2>
          <p className="text-md text-gray-600">
            Thank you for your review! You can’t submit another review for this product.
          </p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="border-b py-2">
                <p className="font-semibold">{review.userId}</p> {/* Update based on your user structure */}
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500">Rating: {review.rating}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
