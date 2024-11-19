"use client";
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

import "./chat.css"
interface param {
  reciverId: string;
  senderId: string;
  friend: {
    id:string;
    name:string;
    url:string
  };
}


interface Message {
  senderid: string;
  content: string;
  receiverid: string;
  time: string;
  id:string;
}


export default function Messages(params: param) {
  console.log(params);
  
  const [arr, setArr] = useState<Message[]>([]);
  const [loading, setloading] = useState(false);
  // useEffect(() => {
  //   setArr([]);
  // }, [])
  useEffect(() => {
    
    fetch(`api/chat/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reciverId: params.reciverId,
        senderId: params.senderId
      }),
    })
      .then((response) => response.json())
      
      .then((data) => {
        setArr([]);
        for(let i = 0; i < data.length; i++){
          setArr((arr) => [...arr, data[i]]);
        }
        setloading(false);
    }
    )

    return () => {
      setArr([]);
    }
  }, [])



  return (
  <div>

    <div className='history'>
    
    <div className='messages'>
        {
      arr.map((item, index) => {
        
        return (
          <div className={`message ${item.senderid === params.reciverId ? 'rtl' : ''}`} key={index}>
            <div className='image'><img src={params.friend.url} alt="" /></div>
            <div className='name'><p>{params.friend.name}</p></div>
            <div className='text'> <p className='message-text'>{item.content}</p></div>
          </div>
        )
      })
        }
    </div>
    </div>
  </div>
);
}
