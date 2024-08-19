import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';


const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  const { suggestedUsers } = useSelector(store => store.auth)
  return (
    <div className='w-fit my-10 pr-32'>
      <div className='flex items-center gap-2'>
        <Link to={`/${user?._id}/profile`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/${user?._id}/profile`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      <div className='my-10'>
        <div className='flex items-center justify-between text-sm'>
          <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
          <span className='mx-10 font-medium cursor-pointer'>See All</span>
        </div>
        {
          suggestedUsers?.map((user) => {
            return (
              <div key={user?._id} >
                <div className='flex items-center gap-2'>
                  <Link to={`/${user?._id}/profile`}>
                    <Avatar>
                      <AvatarImage src={user?.profilePicture} alt="post_image" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <h1 className='font-semibold text-sm'><Link to={`/${user?._id}/profile`}>{user.username}</Link></h1>
                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                  </div>
                </div>
              </div>
            )
          })
        }


      </div>
    </div>
  )
}

export default RightSidebar