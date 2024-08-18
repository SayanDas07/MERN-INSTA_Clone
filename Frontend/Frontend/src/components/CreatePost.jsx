import React, { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { dataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

function CreatePost({ open, setOpen }) {

  const dispatch = useDispatch()
  const imgref = useRef("")
  const [file, setFile] = React.useState("")
  const [caption, setCaption] = React.useState("")
  const [imgpreview, setImgpreview] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const createPostHandeler = async (e) => {
    const formData = new FormData()
    formData.append('caption', caption)
    if(imgpreview){
      formData.append('image', file)
    }
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost',
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      )

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPosts([res.data.data,...posts]))
        setOpen(false)
        //console.log(res.data.data)
        
        
      }
      
      
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)

    } finally {
      setLoading(false)
      
    }

  }

  const fileChangeHandler = async (e) => {
    try {
      const file = e.target?.files[0]
      if (file) {
        setFile(file)
        const fileUrl = await dataURL(file)
        setImgpreview(fileUrl)
      }

    } catch (error) {
      console.log(error)

    }
  }




  return (
    <div>
      <Dialog open={open} setOpen={setOpen}>

        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>

          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-bold text-sm'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>{user?.bio}</span>
            </div>
          </div>

          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
          {
            imgpreview && (
              <div className='w-full h-64 flex items-center justify-center'>
                <img src={imgpreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
              </div>
            )
          }

          <input ref={imgref} type='file' className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => imgref.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>

          {
            imgpreview && (
              loading ? (
                <Button>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </Button>
              ) : (
                <Button onClick={createPostHandeler} type="submit" className="w-full">Post</Button>
              )
            )
          }


        </DialogContent>
      </Dialog>


    </div>
  )
}

export default CreatePost
