import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = (selectedUserId) => {
    const dispatch = useDispatch();
    const { selectedUsers } = useSelector(store=>store.auth);
    useEffect(() => {
        const fetchMessages  = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/get/${selectedUserId}`, { withCredentials: true });
                if (res.data.success) {  
                    dispatch(setMessages(res.data?.messages));
                }
            } catch (error) {
                console.log('Error fetching messages:',error);
            }
        }
        if (selectedUserId) {
            fetchMessages();
          }
    }, [selectedUsers]);
};
export default useGetAllMessages;