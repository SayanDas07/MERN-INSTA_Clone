import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommnetDialoge from './CommnetDialoge'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'


function Post({ post }) {

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(false || post.likes?.includes(user?._id))
  const [postlikes, setPostlikes] = useState(post.likes?.length)
  const [comments, setComments] = useState(post.comments)
  const [commentLength, setCommentLength] = useState('')
  

  useEffect(() => {
    if (comments) {
      setCommentLength(comments.length)
    }

  }, [comments])

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


  const commentOnPostHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, {
        text
      },
        {
          withCredentials: true
        })

      if (res.data.success) {
        toast.success(res.data.message)
        const updatedPostComment = [...comments, res.data.data]
        setComments(updatedPostComment)

        const updatedPostData = posts.map(p => p._id === post._id ? { ...p, comments: updatedPostComment } : p)

        dispatch(setPosts(updatedPostData))
        setText('')
      }

    } catch (error) {
      console.log(error)

    }
  }

  const bookmarkHandeler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, {
        withCredentials: true
      })

      if (res.data.success) {
        toast.success(res.data.message)
        

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
            {user?._id === post?.author?._id && <Badge variant='secondary'>Author</Badge>}

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

          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={bookmarkHandeler} className={`cursor-pointer hover:text-gray-600`} />

      </div>
      <span className='font-medium block mb-2 text-sm'>{postlikes} likes</span>
      <p>
        <span className='font-medium mr-2'>
          {post.author?.username}
        </span>
        {post.caption}
      </p>
      {
        comments.length > 0 && <span onClick={() => {
          dispatch(setSelectedPost(post))
          setOpen(true)
        }} className='text-sm text-gray-600 cursor-pointer'>view {commentLength} commnets</span>
      }

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
          text && <span onClick={commentOnPostHandler} className='text-[#3BADF8] cursor-pointer'>post</span>
        }
      </div>


    </div>

  )
}

export default Post