import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommnetDialoge from './CommnetDialoge'

function Post() {

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)

  const changeHandler = (e) => {
    let input = e.target.value
    if(input.trim()){
      setText(input)
    }else{
      setText('')
    }

  }
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center gap-2'>

        <div className='flex items-center justify-between'>
          <Avatar>
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h1>Username</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
            <Button variant='ghost' className="cursor-pointer w-fit">Delete</Button>
            <Button variant='ghost' className="cursor-pointer w-fit font-bold text-red-700">Unfollow</Button>
          </DialogContent>
        </Dialog>

      </div>

      <img className='rounded-sm my-2 w-full aspect-square object-cover' src="https://images.unsplash.com/photo-1723279230514-c2d1401f794d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="post" />


      <div className='flex items-center justify-between my-2'>
        <div className='flex item-center gap-2'>
          <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
          <MessageCircle onClick = {() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark className='cursor-pointer hover:text-gray-600' />

      </div>
      <span className='font-medium block mb-2'>total_likes</span>
      <p>
        <span className='font-medium mr-2'>
          username
        </span>
        caption
      </p>

      <span onClick = {() => setOpen(true)} className='text-sm text-gray-600 cursor-pointer'>view all commnets</span>
      <CommnetDialoge open = {open} setOpen = {setOpen}/>
      <div className='flex items-center justify-between'>
        <input
          type="text"
          placeholder='Add a comment...'
          value = {text}
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
