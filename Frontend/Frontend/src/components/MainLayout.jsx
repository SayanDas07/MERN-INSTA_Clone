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
    }}>
      <LeftSidebar />

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
