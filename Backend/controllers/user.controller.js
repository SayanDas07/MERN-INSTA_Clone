import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import bcrypt from 'bcryptjs';
import  getDataUri  from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';


const generateAccessTokens = async(userId) => {
    try {

        const user = await User.findById(userId) //now the the user obj is available

        //generating access token and refresh token
        const accessToken = user.generateAccessToken()

        //validateBeforeSave : false - to avoid validation error
        await user.save({ validateBeforeSave : false})


        //user ke diye dilam
        return {accessToken}

        
    } catch (error) {

        return res.status(401).json({
            message: "Something went wrong while generating access token",
            success: false,
        })
        
    }

}

const registerUser = asyncHandler(async (req, res) => {
    //steps
    //1. get user data from req.body
    const{ username, email, password } = req.body
    if(!username || !email || !password){
        return res.status(401).json({
            message: "Something is missing, please check!",
            success: false,
        })
    }
    //2. check if user already exists.3
    const existedUser = await User.findOne({email})
    if(existedUser){
        return res.status(401).json({
            message: "User already exists",
            success: false,
        })
    }

    //3. create user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({username, email, password : hashedPassword})

    const createdUser = await User.findById(user._id).select(
        "-password"
    )
    //4. send response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )



})

const loginUser = asyncHandler(async (req, res) => {
    //steps
    //1. get user data from req.body
    const{ email, password } = req.body
    if(!email || !password){
        return res.status(401).json({
            message: "please provide email and password",
            success: false,
        })
    }
    //2. check if user already exists.3
    let user = await User.findOne({email})
    if(!user){
        return res.status(401).json({
            message: "User not found",
            success: false,
        })
    }

    //3. check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password",
            success: false,
        })
    }
    const {accessToken} =  await generateAccessTokens(user._id)


    const populatedPosts = await Promise.all(
    user.posts.map(async (postId) => {
        const post = await Post.findById(postId)
        if (post && post.author && post.author.equals(user._id)) return post
        else return null
    })
)
    // const loggedInUser = await User.findById(user._id).select("-password")

    // loggedInUser.posts = populatedPosts.filter((post) => post !== null)

    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: populatedPosts
    }

    
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).cookie("accessToken",accessToken,options).json(
        new ApiResponse(200,
            {
                user,
                accessToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.cookie("accessToken", "").json(
        new ApiResponse(200, {}, "User logged out")
    )

})

const getUser = asyncHandler(async (req, res) => {
    const userId = req.params?.id
    if(!userId){
        return res.status(401).json({
            message: " param User not found",
            success: false,
        })
    }

    const user = await User.findById(userId).select("-password")

    await user.populate({
        path: "posts",
        sort: { createdAt: -1 },
    })

    const finaluser = await user.populate(
        "bookmarks"
    )

    if(!finaluser){
        return res.status(401).json({
            message: "User not found",
            success: false,
        })
    }

    return res.status(200).json(
        new ApiResponse(200, finaluser, "User found")
    )
})

const editUser = asyncHandler(async (req, res) => {
    const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));

    
})

const getSuggestedUser = asyncHandler(async (req, res) => {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(401).json({
                message: "No suggested users found",
                success: false,
            })

        }
        return res.status(200).json(
           new ApiResponse(200, suggestedUsers, "Suggested users fetched successfully"))
})


const followOrUnfollow = asyncHandler(async (req, res) => {
    const followKrneWala = req.id; 
        const jiskoFollowKrunga = req.params.id; 
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(401).json({
                message: "You cannot follow yourself",
                success: false,
            })
        }
        const user = await User.findById(followKrneWala)
        const targetUser = await User.findById(jiskoFollowKrunga)
        if (!targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false,
            })
        }

         // mai check krunga ki follow krna hai ya unfollow
         const isFollowing = user.following.includes(jiskoFollowKrunga);
         if (isFollowing) {
             // unfollow
             //pullm means remove
             await Promise.all([
                 User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                 User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
             ])
             return res.status(200).json(new ApiResponse(200, "unfollowed successfully", true))
         } else {
             // follow 
             await Promise.all([
                 User.updateOne(
                    { _id: followKrneWala },
                    { $push: { following: jiskoFollowKrunga } }
                ),
                 User.updateOne(
                    { _id: jiskoFollowKrunga }, 
                    { $push: { followers: followKrneWala } }
                ),
             ])
             return res.status(200).json(new ApiResponse(200, "followed successfully", true));
         } 
})
export { registerUser, loginUser, logoutUser, getUser, editUser,getSuggestedUser, followOrUnfollow }