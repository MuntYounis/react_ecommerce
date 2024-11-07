import { createBrowserRouter } from "react-router-dom";
import Root from '../Root.jsx'
import Home from "../components/user/Home/Home.jsx";
import Register from "../pages/user/Register/Register.jsx";
import Login from "../pages/user/Login/Login.jsx";
import CategoryDetails from "../pages/user/CategoryDetails/CategoryDetails.jsx";
import Product from "../pages/user/Product/Product.jsx";
import { CartDetails } from "../components/cart/CartDetails.jsx";
import Checkout from "../components/checkout/Checkout.jsx";
import Orders from "../components/orders/Orders.jsx";
import Admin from "../components/dashboard/Admin.jsx";


const router = createBrowserRouter([
    {
        path:'/',
        element:<Root />,
        children:[{
            path:'/',
            element:<Home />
        },
        {
            path:'/register',
            element:<Register />
        },
        {
            path:'/login',
            element:<Login />
        },
        {
            path:'/register',
            element:<Register />
        },
        {
            path:'/categoryDetails/:categoryId',
            element:<CategoryDetails />
        },
        {
            path:'/product/:productId',
            element:<Product />
        },
        {
            path:'/cart',
            element:<CartDetails />
        },
        {
            path:'/checkout',
            element:<Checkout />
        },
        {
            path:'/orders',
            element:<Orders />
        },
        {
            path:'/admin',
            element:<Admin />
        }
    ]
    }
]);

export default router;