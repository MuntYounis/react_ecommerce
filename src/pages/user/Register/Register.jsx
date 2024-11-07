import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: ''
        },
        onSubmit: registerUser,
    });

    async function registerUser(values) {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('userName', values.userName);
            formData.append('email', values.email);
            formData.append('password', values.password);

            const { data } = await axios.post('https://ecommerce-node4.onrender.com/auth/signup', formData);
            console.log(data);
            if (data.message === 'success') {
                alert('Verification Email has been sent to your gmail, please verrify before login')
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);

    }

    const handleClickLogin = () => {
        navigate('/login');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-44 mb-24">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                    <input
                        type="text"
                        id="userName"
                        name="userName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={formik.handleChange}
                        value={formik.values.userName}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your username" />
                    {formik.touched.userName && formik.errors.userName ? (
                        <p className="mt-1 text-sm text-red-500">{formik.errors.userName}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your email" />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">User Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your password" />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                    ) : null}
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {loading ? 'Loading...' : 'Register'}
                </button>
                <div className='block text-sm font-base text-gray-700 p-1 mt-2 text-center'>
                    Already have an account? <span className='font-medium cursor-pointer' onClick={handleClickLogin}>Login</span>
                </div>
            </form>
        </div>
    );
}
