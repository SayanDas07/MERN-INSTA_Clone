import {asyncHandler} from '../utils/asyncHandler.js'
import  { Post }  from '../models/post.model.js'
import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { Comment } from "../models/comment.model.js";


const addNewPost = asyncHandler(async (req, res) => {
    try {
        const {caption} = req.body
        const image = req.file
        const authorId = req.id

        // console.log('Caption:', caption)
        // console.log('Image:', image)
        // console.log('Author ID:', authorId)
    
        if (!image) {
            return res.status(400).json({ message: 'Image is required' })
        }
    
        //image upload logic
        //here we use sharp to resize the image
        const bufferImage = await sharp(image.buffer).resize({width: 500, height: 500 , fit: "inside"}).toFormat('jpeg', {quality: 80}).toBuffer()
    
        //convert buffer to base64(uri)
        const fileuri = `data:image/jpeg;base64,${bufferImage.toString('base64')}`
    
        //console.log('File URI:', fileuri)
    
        const response = await cloudinary.uploader.upload(fileuri)
    
        // console.log('Cloudinary Response:', response);
    
        const post = await Post.create({
            caption,
            image: response.secure_url,
            author: authorId
        })
    
        const user = await User.findById(authorId)
        if(user){
            user.posts.push(post._id)
            await user.save()
        }
    
        //we use populate to get the author details in the post object
        await Post.populate(post, {path: 'author', select: '-password'})
    
        return res.status(201).json(new ApiResponse(201, post, 'Post created successfully'))
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal Server Error' })
        
    }

})

const getAllposts = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 })
    .populate({ path: 'author', select: 'username profilePicture' })
    .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
            path: 'author',
            select: 'username profilePicture'
        }
    })

    return res.status(200).json({
        posts,
        success: true
    })


})

const likePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        return res.status(404).json({ message: 'Post not found', success: false })
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

    return res.status(200).json(new ApiResponse(200, {}, 'Post liked successfully'))

})

const dislikePost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        return res.status(404).json({ message: 'Post not found', success: false })
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

    return res.status(200).json(new ApiResponse(200, {}, 'Post disliked successfully'))
})

const addComment = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id
    const { text } = req.body

    const post = await Post.findById(postId)
    if(!post){
        
        return res.status(404).json({ message: 'Post not found', success: false })
    }
    if(!text){

        return res.status(400).json({ message: 'Comment text is required', success: false })
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

    return res.status(201).json(new ApiResponse(201, comment, 'Comment added successfully'))


})

const getAllCommnets = asyncHandler(async (req, res) => {
    const postId = req.params.id

    const post = await Post.findById(postId)
    const comments = await Comment.find({
        post: postId
    }).populate({path: "author", select: "username profilePicture"})

    if(!post){

        return res.status(404).json({ message: 'Post not found', success: false })
    }

    if(comments.length === 0){
      
        return res.status(200).json({ message: 'No comments found', success: true })
    }

    return res.status(200).json(new ApiResponse(200, comments, 'All comments are fetched successfully'))

    
})


import mongoose from 'mongoose';

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const authorId = req.id;  

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found', success: false });

    
    // console.log("Post Author:", post.author);
    // console.log("Author ID from JWT:", authorId);

    

    if (post.author.toString() !== authorId.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete', success: false });
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Remove the post id from the user's post
    let user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json(new ApiResponse(200, {}, 'Post deleted successfully'));
});




const bookmarkPost = asyncHandler(async (req, res) => {
    const postId = req.params.id
    const userId = req.id

    const post = await Post.findById(postId)
    if(!post){
        return res.status(404).json({ message: 'Post not found', success: false })
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

        return res.status(200).json(new ApiResponse(200, {}, 'Post removed from bookmarks successfully'))
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

        return res.status(200).json(new ApiResponse(200, {}, 'Post bookmarked successfully'))
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
    
        return res.status(200).json(new ApiResponse(200, posts, 'All posts fetched successfully'))

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