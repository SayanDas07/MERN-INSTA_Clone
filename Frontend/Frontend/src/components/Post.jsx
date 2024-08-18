import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Badge, Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommnetDialoge from './CommnetDialoge'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

function Post({ post }) {

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const { user } = useSelector(state => state.auth)
  const { posts } = useSelector(state => state.post)
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(false || post.likes?.includes(user?._id))
  const [postlikes, setPostlikes] = useState(post.likes?.length)

  const changeHandler = (e) => {
    let input = e.target.value
    if (input.trim()) {
      setText(input)
    } else {
      setText('')
    }

  }


  const deletePostHandler = async () => {
    try {
      //delete
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, {
        withCredentials: true
      })

      if (res.data.success) {
        toast.success(res.data.message)
        const updatedPosts = posts.filter(p => p?._id !== post?._id)
        dispatch(setPosts(updatedPosts))
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)

    }
  }

  const likeOrDislikePostHandler = async (postId) => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(`http://localhost:8000/api/v1/post/${postId}/${action}`, {
        withCredentials: true
      })

      if (res.data.success) {
        toast.success(res.data.message)
        setLiked(!liked)
        setPostlikes(liked ? postlikes - 1 : postlikes + 1)

        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );
        dispatch(setPosts(updatedPostData));
      }

    } catch (error) {
      console.log(error)

    }
  }
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
            <h1>{post.author?.username}</h1>

          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button>
            }

            <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
            {
              user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit text-red-600">Delete</Button>
            }
          </DialogContent>
        </Dialog>
      </div>

      <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.image} alt="post" />


      <div className='flex items-center justify-between my-2'>
        <div className='flex item-center gap-2'>
          {
            liked ? <FaHeart onClick={() => likeOrDislikePostHandler(post._id)} size={'24'} className='cursor-pointer text-red-700' /> : <FaRegHeart onClick={() => likeOrDislikePostHandler(post._id)} size={'22px'} className='cursor-pointer hover:text-gray-600' />
          }
          
          <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark className='cursor-pointer hover:text-gray-600' />

      </div>
      <span className='font-medium block mb-2 text-sm'>{postlikes} likes</span>
      <p>
        <span className='font-medium mr-2'>
          {post.author?.username}
        </span>
        {post.caption}
      </p>

      <span onClick={() => setOpen(true)} className='text-sm text-gray-600 cursor-pointer'>view all commnets</span>
      <CommnetDialoge open={open} setOpen={setOpen} />
      <div className='flex items-center justify-between'>
        <input
          type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={changeHandler}
          className='outline-none text-sm w-full'
        />
        {
          text && <span className='text-[#3BADF8] cursor-pointer'>post</span>
        }
      </div>


    </div>

  )
}

export default Post
