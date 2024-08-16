import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store.js'
import { setAuthUser } from '@/redux/authSlice'



function LeftSidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    // console.log("user", user)

    // console.log("profile", user.profilePicture)
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout',
                {
                    withCredentials: true
                }
            )

            if (res.data.success) {
                navigate('/login')
                dispatch(setAuthUser(null))
                toast.success(res.data.message)

            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }

    }

    const sidebarHandeler = (text) => {
        if (text === 'Logout') {
            logoutHandler()
        }
    }

    const sidebarItems = [
        {
            icon: <Home />,
            text: 'Home',
        },
        {
            icon: <Search />,
            text: 'Search',
        },
        {
            icon: <TrendingUp />,
            text: "Explore"
        },
        {
            icon: <MessageCircle />,
            text: "Messages"
        },
        {
            icon: <Heart />,
            text: "Notifications"
        },
        {
            icon: <PlusSquare />,
            text: "Create"
        },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        {
            icon: <LogOut />,
            text: "Logout"
        },
    ]


    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => (
                            <div onClick={() => sidebarHandeler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3' >
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>


    )
}

export default LeftSidebar







