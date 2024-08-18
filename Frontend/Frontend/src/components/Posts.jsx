import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux';

function Posts() {
  const { posts } = useSelector(store => store.post);
  return (
    <div>
        {
            posts && posts.map((post) => 
                post && post._id ? <Post key={post._id} post={post} /> : null
            )
        }
    </div>
  )
}

export default Posts
