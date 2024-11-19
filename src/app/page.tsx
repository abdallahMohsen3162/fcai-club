"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./globals.css"
import Post from './components/post/Post';
import Box from './components/Box/Box';

const image = 'https://firebasestorage.googleapis.com/v0/b/fcai-fdd82.appspot.com/o/images%2FScreenshot%202024-02-26%20162524.png?alt=media&token=483dcf24-b38a-4c28-b7c9-b775fba4fc80'


function Home() {
const [posts, setPosts] = useState<Post[]>([]);
const [userId, setUserId] = useState<string>('');
const [loading , setloading] = useState(true);
const [token, setToken] = useState<string>('');
const getData = async () => {
  await fetch('/api/post', {
    method: 'GET',
    cache:"reload",
    headers: {
    'Content-Type': 'application/json'
    }
    })
    .then(res => res.json())
    .then((data) => {
      console.log(data);
      setPosts(data.posts);
      setToken(data.str);
      console.log("posts", posts);
      setloading(false);
      
    })
    .catch(error => console.error('Error fetching posts:', error));
}
  useEffect(() => {
  const id = localStorage.getItem('id');
    if (id) {
    setUserId(id);
    }

    getData();
  
      }, []);


return (
<div>
<div>

{posts.length === 0 ? (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} role="status">
          <div className='spinner' style={{ width: '3rem', height: '3rem' }}></div>
        </div>
      ) : (
        <div>
          <h2>No posts yet</h2>
        </div>
      )}
    </div>
) : (
  
  <div className="container">
    <div className='header'>
      < Post />
      <hr />
    </div>
    {posts.map(post => (
      <div key={post.id}>
        < Box {...post}/>
      </div>
    ))}
      
      <hr />
      <br /><br /><br />
  </div>
)}

</div>


</div>
);
}

export default Home;