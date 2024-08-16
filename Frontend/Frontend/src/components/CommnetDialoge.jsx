import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

function CommnetDialoge({ open, setOpen }) {
  const [text, setText] = useState('')

  const changeEventHandeler = (e) => {
    let input = e.target.value
    if (input.trim()) {
      setText(input)
    }else{
      setText('')
    }
  }

  const sendMessageHandeler = async () => {
    alert(text)

  }



  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
        <div className='flex flex-1'>
          <div className='w-1/2'>
            <img
              src="https://images.unsplash.com/photo-1723279230514-c2d1401f794d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-xs'>username</Link>
                  {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
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
              commnets
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident in inventore, ipsam aut explicabo aperiam veniam dolorum perferendis hic maiores laboriosam harum fuga dignissimos ipsa deserunt sed. Labore nemo porro ratione voluptatem, aspernatur ipsum!
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input type="text" value = {text} onChange={changeEventHandeler} placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                <Button disabled = {!text.trim()} onClick = {sendMessageHandeler} variant="outline">Send</Button>
              </div>
            </div>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommnetDialoge
