import React from 'react'
import Post from './Post'

function Posts() {
  return (
    <div>
        {
            [1,2,3,4,5].map((index, key) => <Post key={index} />)
        }
    </div>
  )
}

export default Posts
