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
    
    <div className='flex flex-col lg:flex-row'>
      
            <div className='flex-grow lg:w-[70%] px-4 lg:px-8 py-4'>
            
            <Feed />
            <Outlet />
                
                
                
            </div>
            <div className='hidden lg:block lg:w-[30%]'>
        <RightSidebar />
      </div>
            
        </div>
)
}

export default Home
