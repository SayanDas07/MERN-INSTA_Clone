import {asyncHandler} from '../utils/asyncHandler.js'
import  { Post }  from '../models/post.model.js'
import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'

const addNewPost = asyncHandler(async (req, res) => {
    const {caption} = req.body
    const {image} = req.files
    const authorId = req.id

    if (!caption || !image) {
        throw new ApiError(400,'Please provide caption and image')
    }

    //image upload logic
    //here we use sharp to resize the image
    const bufferImage = await sharp(image.buffer).resize({width: 500, height: 500 , fit: "inside"}).toFormat('jpeg', {quality: 80}).toBuffer()

    //convert buffer to base64(uri)
    const fileuri = `data: image/jpeg;base64,${bufferImage.toString('base64')}`

    const respose = await cloudinary.uploader.upload(fileuri)

    const post = await Post.create({
        caption,
        image: respose.secure_url,
        author: authorId
    })

    const user = await user.findById(authorId)
    if(user){
        user.posts.push(post._id)
        await user.save()
    }

    //we use populate to get the author details in the post object
    await Post.populate(post, {path: 'author', select: '-password'})

    res.status(201).json(new ApiResponse(201, post, 'Post created successfully'))

})

const getAllposts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({createdAt: -1}).populate({path: 'author', select: 'username profilePicture'}).popolate({
        path: 'comments',
        createdAt: -1,
        populate: {
            path: 'author',
            select: 'username profilePicture'
        }
    })

    res.status(200).json(new ApiResponse(200, posts, 'All posts are fetched successfully'))


})

const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(404, 'Post not found')
    }

    //like logic
    await post.updateOne({
        $addToSet: {
            likes: userId
        }
    },
    {
        new: true
    })

    //TODO : socket.io logic for real time like update

    res.status(200).json(new ApiResponse(200, {}, 'Post liked successfully'))

})

const dislikePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(404, 'Post not found')
    }

    //dislike logic
    await post.updateOne({
        $pull: {
            likes: userId
        }
    },
    {
        new: true
    })

    //TODO : socket.io logic for real time dislike update

    res.status(200).json(new ApiResponse(200, {}, 'Post disliked successfully'))
})

const addComment = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id
    const { text } = req.body

    const post = await Post.findById(postId)
    if(!post){
        
        throw new ApiError(400 ,'Post not found')
    }
    if(!text){

        throw new ApiError(400 ,'Please provide comment text')
    }

    const comment = await Comment.create({
        text,
        post: postId,
        author: userId
    }).popolate({
        path: 'author',
        select: 'username profilePicture'
    })

    post.comments.push(comment._id)

    await post.save()

    //TODO : socket.io logic for real time comment update

    res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'))


})

const getAllCommnets = asyncHandler(async (req, res) => {
    const postId = req.params.id

    const post = await Post.findById(postId)
    const comments = await Comment.find({
        post: postId
    }).populate({path: "author", select: "username profilePicture"})

    if(!post){

        throw new ApiError(404,'Post not found')
    }

    if(comments.length === 0){
      
        throw new ApiError(404,'No comments found')
    }

    res.status(200).json(new ApiResponse(200, comments, 'All comments are fetched successfully'))

    
})

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)

    if(!post){
        throw new ApiError(404, 'Post not found')
    }

    //check if the user is the author of the post
    if(post.author.toString() !== userId){
        throw new ApiError(403, 'You are not authorized to delete this post')
    }

    //delete the post
    await Post.findByIdAndDelete(postId)

    //delete the post from the user's post array
    await User.findByIdAndUpdate({
        _id: userId
    },
    {
        $pull: {
            posts: postId
        }
    },
    {
        new: true
    })

    //delete the post's comments
    await Comment.deleteMany({
        post: postId
    })

    res.status(200).json(new ApiResponse(200, {}, 'Post deleted successfully'))


})

const bookmarkPost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        throw new ApiError(404, 'Post not found')
    }
    //add to bookmark
    const user = await User.findById(userId)
    if(user.bookmarks.includes(userId)){
        //remove from bookmarks
        await user.updateOne({
            $pull: {
                bookmarks: postId
            }
        },
        {
            new: true
        })

        res.status(200).json(new ApiResponse(200, {}, 'Post removed from bookmarks successfully'))
    }else{
        //add to bookmarks
        await user.updateOne({
            $addToSet: {
                bookmarks: postId
            }
        },
        {
            new: true
        })

        res.status(200).json(new ApiResponse(200, {}, 'Post bookmarked successfully'))
    }

    
})

const getUserposts = asyncHandler(async (req, res) => {
    const authorId = req.id
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        })
    
    res.status(200).json(new ApiResponse(200, posts, 'All posts fetched successfully'))

})
export {addNewPost,
    getAllposts,
    likePost,
    dislikePost,
    addComment,
    getAllCommnets,
    deletePost,
    bookmarkPost,
    getUserposts
}