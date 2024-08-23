
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllSuggestedUsers = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllSuggestedUsers = async () => {
            try {
                const res = await axios.get('https://mern-insta-clone-1.onrender.com/api/v1/user/suggested',
                    { withCredentials: true }
                )

                if (res.data.success) {
                    //console.log(res.data.posts);
                    dispatch(setSuggestedUsers(res.data.data));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllSuggestedUsers();
    }, []);
};
export default useGetAllSuggestedUsers;