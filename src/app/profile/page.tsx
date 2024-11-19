"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import "./profile.css"
import { uploadImage } from '../../../firebase/uploadImage';
import { json } from 'stream/consumers';
import Box from '../components/Box/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import PostEdit from '../components/postedit/PostEdit';

const defaultinage = 'https://firebasestorage.googleapis.com/v0/b/fcai-fdd82.appspot.com/o/images%2FScreenshot%202024-02-26%20162524.png?alt=media&token=483dcf24-b38a-4c28-b7c9-b775fba4fc80'
export default function Page() {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [loading , setloading] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [postsloading, setPostsloaded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [msg, setmsg] = useState("");
  useEffect(() => {
    fetch(`/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then((data) => {
        setUsername(data.user.name);
        setUrl(data.user.url);
        setUserId(data.userId); // Assuming the response contains a field `userId`
        console.log(data);
        
      })
      .catch(error => console.error('Error fetching profile:', error));
  }, []);

  const handleFileChange = (event:any) => {
    setNewFile(event.target.files[0]);
  };

  const handleEdit = async () => {
    setloading(true);
    let imageUrl = url;
    if (newFile) {
      // Assume uploadImage is a function to upload an image and return its URL
      imageUrl = await uploadImage(newFile);
    }

    fetch(`/api/edit`, {
      method: "PUT",
      body: JSON.stringify({ id: localStorage.getItem('id'), name: newUsername || username, url: imageUrl }),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setUsername(newUsername || username);
        setUrl(imageUrl);
        setNewUsername("");
        setNewFile(null);
        setloading(false);
        setmsg(data.message);
      })
      .catch(error => console.error('Error updating profile:', error));
  };

  const fetchPosts = async () => {
    setShowPosts(true);
    setPostsloaded(true);
    const body = JSON.stringify({
      id: localStorage.getItem("id"),
    });
  
    try {
      const response = await fetch("api/postsof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      setPosts(data.posts);
      setPostsloaded(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  

  return (
    <div>
      <div className='profile'>
        <h1>Profile</h1>
        <p>Username: <strong>{username}</strong></p>
        <img src={url} alt="Profile Picture" />
      </div>

      <div className='edit'>
        <input 
          type="text" 
          placeholder='Enter new username' 
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input 
          type="file" 
          onChange={handleFileChange}
        />
        <button onClick={handleEdit}>
        {
        loading ? <div className="spinner loading-white"></div> : "Edit"
        }
        </button>
      
      </div>
      {msg && <p className={`${msg == 'User updated successfully' ? 'accepted' : 'rejected'}`}>{msg}</p>}
      {
        showPosts?(
          postsloading?(
           <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
             <div className='spinner'></div>
           </div>
          ):(
            posts.map((post : any) => (
              <PostEdit {...post} key={post.id}/>
            ))
          )
        ):(
          <button className='btn show' onClick={() => fetchPosts()}>
            <FontAwesomeIcon icon={faEdit} />
          </button>)
      }

    </div>
  )
}
