import React, { useEffect, useState } from 'react';
import "./box.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faLink, faPlus } from '@fortawesome/free-solid-svg-icons';
import Comments from '../comments/Comments';

interface Post {
  id: string;
  content: string;
  createdAt: string;
  image: string;
  userid: string;
  username: string;
  userImage: string;
}

export default function Box(post: Post) {
  const [comments, setComments] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [content, setContent] = useState<string>('');
  const [load, setLoad] = useState(false);
  const postComment = () => {
    fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
        content: content,
        userId: localStorage.getItem("id"),
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })

    setContent("")
  }
  const trigger = (setload: boolean) => {
    setLoad(setload);
  }

  const copyLink = (postId: string) => {
    let lnk = window.location.href;
    navigator.clipboard.writeText(`${lnk}linkedpost/${postId}`);
    console.log(`${lnk}linkedpost/${postId}`);
  }
  return (
    <div key={post.id} className='box'>
      <div className='user-details'>
        <img src={post.userImage} alt={`${post.username}'s profile`} />
        <div>
          <div className='username'>{post.username}</div>
          <div className='createdAt'>{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <div className='content'>
        {post.content}
      </div>
      {post.image && (
        <div className='post-image'>
          <img src={post.image} alt='Post content' />
        </div>
      )}

      {
        addComment && (
          <div className='add-comment'>
            <input 
            type="text"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            />
            <button onClick={() => postComment()}>Post</button>
          </div>
        )
      }

      {
        comments && <Comments postid={post.id} trigger={trigger}/>
      }
      <div className='interactions'>
        <button onClick={() => {setComments(!comments)}}>
        {load ? <div className='spinner'></div> : 'Comments'}
        </button>
        <button onClick={() => {setAddComment(!addComment)}}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={() => copyLink(post.id)} className='linked-post'>
          <FontAwesomeIcon icon={faLink} />
        </button>
      </div>

      <div className='notification'>

      </div>
    </div>
  );
}
