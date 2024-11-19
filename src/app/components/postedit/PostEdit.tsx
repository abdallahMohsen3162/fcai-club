import React from 'react'
import "./postedit.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

interface PostEditProps {
  id: string;
  content: string;
  userid: string;
  createdAt: string;
  image: string;
}

export default function PostEdit(post: PostEditProps) {

  const del = async () => {
     await fetch("api/deletepost", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postid: post.id
      }),
    }).then((res) => res.json()).then((data) => {
      console.log(data);
      
    })

    }
  

  const HandleDelete = () => {
    swal("هتمسح ظ")
    .then((value) => {
      if(value){
        del()
      }
    });
  }
  
  

  
  return (
    <div className='post-edit'>
      <p>{post.content}</p>
      <p>at: {(new Date(post.createdAt)).toLocaleString()}</p>
      <img src={post.image} alt="" />
      <button onClick={HandleDelete}><FontAwesomeIcon icon={faTrash} /></button>

    </div>
  )
}
