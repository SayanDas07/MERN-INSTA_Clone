import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch} from "react-redux";

const useUserProfileFollowUnfollow = (userId) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`https://mern-insta-clone-1.onrender.com/api/v1/user/followorunfollow/${userId}`,
                    { withCredentials: true }
                )

                if (res.data.success) {
                    //console.log(res.data.posts);
                    dispatch(setUserProfile(res.data.data));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);


};

export default useUserProfileFollowUnfollow
