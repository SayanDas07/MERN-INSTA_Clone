import userGetUserProfile from '@/hooks/UseGetUserProfile';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { setUserProfile } from '@/redux/authSlice';
import useUserProfileFollowUnfollow from '@/hooks/UseUserProfileFollowUnfollow ';
import axios from 'axios';

function Profile() {
  const params = useParams();
  const userId = params.id;
  userGetUserProfile(userId);

  const { userProfile, user } = useSelector(store => store.auth);
  //console.log(userProfile);

  const isLoggedInUser = user?._id === userProfile?._id;
  //console.log(isLoggedInUser);
  const isFollowing = userProfile?.followers.includes(user?._id);
  //console.log(isFollowing);
  const [activeTab, setActiveTab] = React.useState('posts')

  const tabChangeHandeler = (tab) => {
    setActiveTab(tab)
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  // useUserProfileFollowUnfollow(userId)

  // const handleFollowUnfollow = async () => {
  //   try {
  //     const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userId}`, {}, { withCredentials: true });

  //     if (res.data.success) {
  //       const updatedUser = [...user, res.data.user?.followers]
  //       dispatch(setUserProfile(updatedUser))
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center' >
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>
                  {userProfile?.username}
                </span>
                {
                  isLoggedInUser ? (
                    <>
                      <Link to='/profile/edit'>
                        <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                      </Link>

                    </>) : (
                    isFollowing ? (
                      <>
                        <Button variant="secondary" className='h-8' >Unfollow</Button>
                        <Link to='/chat' ><Button variant="secondary" className='h-8'>Message</Button></Link>
                      </>
                    ) : (
                      <>
                        <Button className='bg-[#0095F6] hover:bg-[#08263b] h-8' >Follow</Button>
                        <Link to='/chat' ><Button variant="secondary" className='h-8'>Message</Button></Link>
                      </>



                    )
                  )
                }
              </div>

              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>

              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                <span>🤯Hii</span>
                <span>🤯This is my ACC</span>

              </div>


            </div>
          </section>

        </div>

        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => tabChangeHandeler('posts')}>
              POSTS
            </span>
            <span className={`py-9 px-11 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => tabChangeHandeler('saved')}>
              SAVED
            </span>

          </div>

          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post?.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes?.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments?.length}</span>
                        </button>
                      </div>
                    </div>


                  </div>
                )
              })
            }
          </div>

        </div>
      </div>



    </div>
  )
}

export default Profile