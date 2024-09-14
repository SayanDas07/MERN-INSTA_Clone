import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux'
import backgroundImage from '../assets/back.webp'

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth)

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const signupHandeler = async (e) => {
    e.preventDefault()
    console.log(input)

    try {
      setLoading(true)
      const res = await axios.post(`https://mern-insta-clone-1.onrender.com/api/v1/user/register`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })

      if (res.data.success) {
        navigate('/login')
        toast.success(res.data.message)
        setInput({
          username: "",
          email: "",
          password: ""
        })

      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [])
  return (
    <div className='flex items-center w-screen h-screen justify-center text-white min-h-[calc(100vh-64px)]'
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}

    >
      <form onSubmit={signupHandeler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <Label className='font-medium'>Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2 text-black"
          />
        </div>
        <div>
          <Label className='font-medium'>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2 text-black"
          />
        </div>
        <div>
          <Label className='font-medium'>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2 text-black"
          />
        </div>
        {
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button type='submit'>Signup</Button>
          )
        }


        <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>

      </form>
    </div>
  )
}

export default Signup
