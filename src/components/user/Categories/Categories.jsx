import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';
import useFetchData from '../../../customHooks/useFetchData';

export default function Categories() {
    const { data, loading, error } = useFetchData(`https://ecommerce-node4.onrender.com/categories/active`);

 
    if (error) {
        return <div className="alert alert-danger text-center text-red-500">{error}</div>;
    }

    return (
        <section className="categories px-6 py-20 bg-gray-50 ">
            <h2 className="text-3xl font-bold text-center mb-10">Product Categories</h2>
            {
                loading ? <>
                    <h2 className="text-center text-xl font-semibold h-[400px]" >Loading...</h2>
                </>
                    :
                    <>
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={30}
                            slidesPerView={3}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                            className="w-full h-[400px]"
                        >
                            {data.categories.map(category => (
                                <SwiperSlide key={category._id} className="flex justify-center items-center">
                                    <Link to={`/categoryDetails/${category._id}`} className="block p-4 mb-10 hover:shadow-lg transition-shadow duration-300 ease-in-out">
                                        <img
                                            src={category.image.secure_url}
                                            alt={category.name}
                                            className="w-full h-44 object-cover rounded-md mb-2 transition-transform transform hover:scale-105 duration-300"
                                        />
                                        <p className="text-center text-lg font-medium">{category.name}</p>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    </>
            }


        </section>
    );
}
