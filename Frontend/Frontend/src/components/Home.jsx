import React from 'react'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import useGetAllPost from '@/hooks/UseGetAllPosts'

function Home() {
  useGetAllPost();
  return (
    
    <div className='flex'>
      
            <div className='flex-grow'>
            
            <Feed />
            <Outlet />
                
                
                
            </div>
            <RightSidebar />
            
        </div>
)
}

export default Home
