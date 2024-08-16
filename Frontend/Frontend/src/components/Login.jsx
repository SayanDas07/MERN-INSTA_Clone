import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice.js'


function Login() {
  const [input, setInput] = useState({
    
    email: "",
    password: ""
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
      const res = await axios.post(`http://localhost:8000/api/v1/user/login`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })
      console.log('API Response:', res.data);

      if (res.data.success) {
        console.log('Dispatching user to Redux store:', res.data.data.user)
        dispatch(setAuthUser(res.data.data.user))
        navigate('/')
        

        toast.success(res.data.message)
        setInput({
          
          email: "",
          password: ""
        })

      } 
    } catch (error) {
      toast.error(error.response.data.message)
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={signupHandeler} className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
          <h1 className='text-center font-bold text-xl'>LOGO</h1>
          <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
        </div>
        
        <div>
          <Label className='font-medium'>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <Label className='font-medium'>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }

        <span className='text-center'>Dosent have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>

      </form>
    </div>
  )
}

export default Login
