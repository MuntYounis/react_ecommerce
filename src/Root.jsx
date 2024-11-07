import React from 'react'
import Navbar from './components/user/Navbar/Navbar'
import Footer from './components/user/Footer/Footer'
import { Outlet } from 'react-router-dom'

export default function () {
  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}
