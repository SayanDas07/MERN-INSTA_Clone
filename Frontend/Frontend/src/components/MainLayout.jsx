import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import backgroundImage from '../assets/back.webp'


function MainLayout() {
  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
      className="text-white flex items-center justify-center min-h-[calc(100vh-64px)]">
      <LeftSidebar />

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
