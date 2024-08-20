import { BugOffIcon, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'



function LeftSidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false)
    const { user } = useSelector(store => store.auth)
    // console.log("user", user)

    // console.log("profile", user.profilePicture)

    const { likeNotification } = useSelector(store => store.realTimeNotification)
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
                dispatch(setPosts([]))
                dispatch(setSelectedPost(null))
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
        else if (text === "Create") {
            setOpen(true)

        }
        else if (text == "Profile") {
            navigate(`/profile/${user?._id}`)
        }
        else if (text == "Home") {
            navigate('/')
        }
        else if (text == "Messages") {
            navigate('/chat')
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
                                {
                                    item.text === 'Notifications' && likeNotification.length > 0 && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
                                                    {
                                                        likeNotification.filter(notification => notification.userId !== user?._id).length
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div>
                                                    {
                                                        likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                            likeNotification.map((notification) => {
                                                                // Check if the current user's ID matches the notification's userId
                                                                if (notification.userId !== user?._id) {
                                                                    return (
                                                                        <div key={notification.userId} className="flex items-center gap-2 my-2">
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className="text-sm">
                                                                                <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                                return null; // Return null to skip rendering the notification
                                                            })
                                                        )
                                                    }
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>




    )
}

export default LeftSidebar







