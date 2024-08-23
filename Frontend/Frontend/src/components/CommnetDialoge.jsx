import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { setPosts } from '@/redux/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import axios from 'axios'
import { toast } from 'sonner'


function CommnetDialoge({ open, setOpen }) {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const { selectedPost, posts } = useSelector(store => store.post)
  const [comments, setComments] = useState([])
  


  
  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost?.comments)
    }

    
  }, [selectedPost])


  const changeEventHandeler = (e) => {
    let input = e.target.value
    if (input.trim()) {
      setText(input)
    } else {
      setText('')
    }
  }

  const sendMessageHandeler = async () => {
    try {
      const res = await axios.post(`https://mern-insta-clone-1.onrender.com/api/v1/post/${selectedPost?._id}/comment`, {
        text
      },
        {
          withCredentials: true
        })

      if (res.data.success) {
        toast.success(res.data.message)
        const updatedPostComment = [...comments, res.data.data]
        setComments(updatedPostComment)

        const updatedPostData = posts.map(p => p._id === selectedPost?._id ? { ...p, comments: updatedPostComment } : p)

        dispatch(setPosts(updatedPostData))
        setText('')
      }

    } catch (error) {
      toast.error(error.response.data.message)

    }

  }



  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src={selectedPost?.image} alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                  <span className='text-gray-600 text-sm'>{selectedPost?.author?.bio}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className='cursor-pointer' />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
              {
                comments.map(comment => < SingleComment key={comment._id} comment={comment} />)
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" value={text} onChange={changeEventHandeler} placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                <Button disabled={!text.trim()} onClick={sendMessageHandeler} variant="outline">Send</Button>
              </div>
            </div>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommnetDialoge
