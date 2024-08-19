import React from 'react'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import Feed from './Feed'
import useGetAllPost from '@/hooks/UseGetAllPosts'
import useGetAllSuggestedUsers from '@/hooks/UseGetAllSuggestedUsers'

function Home() {
  useGetAllPost();
  useGetAllSuggestedUsers();
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
