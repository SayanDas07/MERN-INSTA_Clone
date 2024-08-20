import { createSlice } from "@reduxjs/toolkit";
import { SunDim } from "lucide-react";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers : [],
        userProfile : null,
        selectedUsers : null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setSelectedUsers: (state, action) => {
            state.selectedUsers = action.payload
        }
        
    },
})

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUsers } = authSlice.actions

export default authSlice.reducer