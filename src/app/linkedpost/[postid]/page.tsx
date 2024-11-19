"use client"
import React, { useEffect, useState } from 'react'
import "./linkedpost.css"
import { useParams } from 'next/navigation'

export default function Page() {
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState({
    content: '',
    createdAt: '',
    id: '',
    image:''
  })
  const [user, setuser] = useState({
    name: '',
    url: ''
  })
  const params = useParams()
  console.log(params);

  useEffect(() => {
    fetch(`/api/onepost?id=${params.postid}`).then((res) => res.json())
    .then((data) => {
      console.log(data);
      setPost(data.post)
      setLoading(false)
      setuser(data.user)
    })
  }, [params.postid])

  if(loading){
    return <div className='linked'>
      <div className='spinner'></div>
    </div>
  }
  return (
    <div className='linked'>
      <div className='user'>
          <img src={user.url} alt={user.name} />

        <p>{user.name}</p>
      </div>
      <div className='linked-post'>
        <p className='content'>{post.content}</p>
        {post.image && <img src={post.image} alt="Post image" />}
        <p>{(new Date(post.createdAt).toLocaleString())}</p>
      </div>
    </div>
  )
}
