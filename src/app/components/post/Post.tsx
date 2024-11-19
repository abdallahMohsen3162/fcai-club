// components/ContentImageInput.tsx
"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import "../../post/post.css";
import { useRouter } from 'next/navigation';
import { uploadImage } from '../../../../firebase/uploadImage';


const Post = () => {
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [url , setUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content && !image) {
      alert("Please enter content and choose an image");
      return;
    }
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
      }
      const userid = localStorage.getItem('id');
      setUrl(imageUrl);
      console.log(userid, content, imageUrl);
      console.log(imageUrl);
      
      const response = await fetch('/api/post', {
        method: 'POST',
        body: JSON.stringify({ userid, content, url:imageUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      console.log(data);
      if (data.msg === "Success") {
        setLoading(false);
        router.push('/');
        window.location.reload();
      }
    } catch (error) {
      alert("Error creating post");
      setLoading(false);
    }
  };

  
  return (
    <div className='post'>
    <form onSubmit={handleSubmit}>
      <textarea 
        rows={10}
        cols={50}
        value={content}
        placeholder="Enter your content here"
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="file-input-container">
        <label htmlFor="file-input" className="file-input-label">
          Choose an image
        </label>
        <input 
          type="file"
          id="file-input"
          className='file-input'
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setImage(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      {imagePreview && <img src={imagePreview} alt="Preview" />}
      <button type="submit" className='btn-submit' disabled={loading}>
        {loading ? <div className='spinner'></div> : 'Post'}
      </button>
    </form>
  </div>

  );
};

export default Post;
