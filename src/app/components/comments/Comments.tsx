import React, { useEffect, useState } from 'react';
import "./comments.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const img = "https://firebasestorage.googleapis.com/v0/b/fcai-fdd82.appspot.com/o/images%2Fme.jpg?alt=media&token=8fc08264-3b93-4166-956f-6056f5913aa9";
const img2 = "https://firebasestorage.googleapis.com/v0/b/fcai-fdd82.appspot.com/o/images%2F438161564_957368552548885_1315607263381153597_n.jpg?alt=media&token=c737e29b-10ce-4cef-998f-2686c093d434"

let st = new Set<string>()
export default function Comments(params: { postid: string, trigger:any }) {
  let [comments, setComments] = useState([]);
  const [cnt, setCnt] = useState(0)
  console.log(params.postid);
  
  useEffect(() => {
    const fetchComments = async () => {
      params.trigger(true);
      try {
        const response = await fetch(`/api/comments?postId=${params.postid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache:"default",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.comments);
          setComments(data.comments);
          params.trigger(false);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
    return () => {};
  }, [])

  const DeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ commentId }),
      });
  
      if (response.ok) {
        st.add(commentId)
        setCnt(cnt + 1)
        console.log('Comment deleted successfully');
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  if (comments.length == 0) {
    return (
      <div className='comments'>
        <p></p>
      </div>
    );
  }
  return (
    <div className='comments'>
      {comments.map((el: any, idx) => {
        if(st.has(el.id)) return null
        return (
          <div className='comment' key={idx}>

            <div className='comment-user-image'>
              <img src={el.userImage} alt="" />
            </div>

            <div>
              <p>
                {el.content}
              </p>
            </div>

            {
              el.userId == localStorage.getItem("id") &&
              <div className='delete'>
              <button onClick={() => DeleteComment(el.id)}>
                <FontAwesomeIcon icon={faTrash}/>
              </button>
            </div>
            }
          </div>
        );
      })}
    </div>
  );
}
