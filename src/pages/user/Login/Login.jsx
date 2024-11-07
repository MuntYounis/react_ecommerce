import { useFormik } from 'formik'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: loginUser,
    });

    async function loginUser() {
        try {
            const { data } = await axios.post(`https://ecommerce-node4.onrender.com/auth/signin`, formik.values)
            console.log(data);
            if (data.message == 'success') {
                localStorage.setItem('userToken', data.token);
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickRegister = () => {
        navigate('/register')
    }

    return (
        <div class="max-w-md mx-auto  p-6 bg-white shadow-lg rounded-lg mt-44 mb-24">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
            <form onSubmit={formik.handleSubmit}>
                <div class="mb-4">
                    <label htmlFor="email" class="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={formik.handleChange}
                        value={formik.email}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your email" />
                    {formik.touched.email && formik.errors.email ? (
                        <p class="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div class="mb-6">
                    <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1">User Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={formik.handleChange}
                        value={formik.password}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your password" />
                    {formik.touched.password && formik.errors.password ? (
                        <p class="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                    ) : null}
                </div>
                <button
                    type="submit"
                    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Login
                </button>
                <div className='block text-sm font-base text-gray-700 p-1 mt-2 text-center'>
                    don't have an account? <span className='font-medium cursor-pointer' onClick={handleClickRegister}>Register</span>
                </div>
            </form>
        </div>

    )
}
