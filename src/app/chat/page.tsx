"use client";
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import "./chat.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faComment } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'firebase/storage';

function procces_string(message: string){
  let msg = ``
  let cnt = 0;
  for(let i = 0; i < message.length; i++){
    if(cnt == 20){
      cnt = 0;
      msg += `\n`;
    }
    msg += message[i];
    cnt++;
  }
  return msg;
}

interface User {
  name: string;
  id: string;
  url: string;
}

interface Message {
  senderid: string;
  content: string;
  receiverid: string;
  time: string;
  id: string;
}

interface MessagesProps {
  reciverId: string;
  senderId: string;
  friend: User;
  id_typing: string;
}
let Myurl = "";
let Myname = "me"
let global_socket: Socket;
export default function Page() {
  const [message, setMsg] = useState<string>(``);
  const [coming, setComing] = useState([]);
  const socket = useRef<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string>("-1");
  const [chatStyleObject, setChatStyleObject] = useState("chat-sidebar");
  const [friend, setFriend] = useState<User | null>(null);
  const [arr, setArr] = useState<Message[]>([]); // Lifted state
  const [id_typing, set_id_typing] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggler = () => {
    let str: string = chatStyleObject;
    let classes = str.split(" ");
    if (classes.includes("active")) {
      setChatStyleObject("chat-sidebar");
    } else {
      setChatStyleObject("chat-sidebar active");
    }
  }

  const typing = () => {
    
    socket.current?.emit("typing", {
      reciverId: selected,
      senderId: localStorage.getItem("id"),
    });
  }

  const send = () => {
    socket.current?.emit("send-message-to", {
      reciverId: selected,
      message: message,
      senderId: localStorage.getItem("id"),
    });
    let msg: Message = {senderid:localStorage.getItem("id")!, content: procces_string(message), receiverid: selected, time: new Date().toLocaleString(), id: "data.id"}

    setArr((arr) => [...arr, msg]);
    setMsg(``);
  }

  const fetchMessages = (reciverId: string, senderId: string) => {
    fetch(`api/chat/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reciverId: reciverId,
        senderId: senderId
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setArr([]);
        for (let i = 0; i < data.length; i++) {
          setArr((arr) => [...arr, data[i]]);
        }
      });
  }

  useEffect(() => {
    socket.current = io("https://power-blush-ball.glitch.me");
    socket.current.emit("new-user-add", localStorage.getItem("id"));
    global_socket = socket.current;
    socket.current.on("connect", () => {
      console.log("Connected: ", socket.current?.id);
    });

    socket.current.on("notification", (data) => {
      console.log(data);
      setArr((arr) => [...arr, {
        content: data.message,
        receiverid: data.reciverId,
        senderid: data.senderId,
        time: new Date().toLocaleString(),
        id: "data.id"
      }]);
  
    });
    socket.current.on("accept_typing", (data) => {
      console.log(data);
      set_id_typing(data.senderId);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected: ", socket.current?.id);
      
    });


    fetch("/api/chat/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }).then((res) => res.json()).then((data) => {
      console.log(data);
      setUsers(data.users.filter((user: { id: string | null; }) => user.id !== localStorage.getItem("id")));
      for(let i = 0; i < data.users.length; ++i){
        if(data.users[i].id == localStorage.getItem("id")){
          Myurl = data.users[i].url;
          Myname = data.users[i].name
        }
      }
      setDisplayedUsers(data.users);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);


  useEffect(() => {
    let timer = setInterval(() => {
      set_id_typing('');
    }, 1000)

    return () => {
      clearInterval(timer);
    }
    
  }, []);

  useEffect(() => {
    setDisplayedUsers(users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, users]);

  const adapt_friend = (id: string) => {
    setSelected("-1")
    setFriend(null);
    setSelected(id);
    setFriend(users.find((user) => user.id === id) || null);
    fetchMessages(id, localStorage.getItem("id")!); // Fetch messages when a friend is selected
  }

  

  return (
    <div>
      <div className={chatStyleObject}>
        <input 
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search'
          className='search'
          type="text"
        />

        
        {
        displayedUsers.map((user) => (
          <div key={user.id} className='user' onClick={() => { adapt_friend(user.id) }}>
            <div className='user-image'>
              <img src={user.url} alt={user.name} />
            </div>
            <div className='user-info'>
              <p>{user.name}</p>
            </div>

            {user.id === id_typing && <div className='typing'>typing...</div>}
          </div>
        ))
        }
        
      </div>
      <div className='toggler'>
        <button onClick={toggler}>
          <FontAwesomeIcon icon={faComment} />
        </button>
      </div>
      {
        (selected !== "-1" && friend) ? (
          
          <div className='chat'>
            <h1>
              <FontAwesomeIcon icon={faClose} onClick={() => setSelected("-1")} />
            </h1>
              
            <Messages 
              reciverId={selected} 
              senderId={localStorage.getItem("id")!} 
              friend={friend} 
              id_typing={id_typing}
              arr={arr} 
              setArr={setArr} 
              messagesEndRef={messagesEndRef}
            />

            <div className='inputs'>
              <button className='btn' onClick={send}>
                <FontAwesomeIcon icon={faComment} />
              </button>
              <textarea 
                className='texarea'
                rows={4}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), send()) : null} 
                onChange={(e) => {typing(); setMsg(`${e.target.value}`)}} 
                value={message} 
              />
            </div>
          </div>
        ) : ('')
      }
    </div>
  );
}


function Messages({ reciverId, senderId, friend, arr, setArr, messagesEndRef, id_typing }: MessagesProps & { arr: Message[], setArr: React.Dispatch<React.SetStateAction<Message[]>>, messagesEndRef: React.RefObject<HTMLDivElement> }) {
  let newarr : Message[]= [];


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo(0, messagesEndRef.current.scrollHeight);
    }
  }, [arr]);


  return (
    <div className='history-parent'>
      <div className='history'>
        <div className='name'>
          <img style={{width: "40px"}} src={friend.url} alt="" /><p>{friend.name}</p>
        </div>
        {
          (id_typing == friend.id) && <div className='typing'>typing...</div> 
        }
        <div className='messages' ref={messagesEndRef}>
          {
            arr.map((item, index) => {
              let img = Myurl;
              let classes = "message "
              let me = true;
              if(item.receiverid === localStorage.getItem("id") ){
                img = friend.url;
                classes = "message rtl" ;
                me = false
              }
              if(friend.id === item.senderid || friend.id === item.receiverid){
                return (
                  <div className={classes} key={index}>
                    <div className='image'><img src={img} alt="" /></div> {me ? ' (me) ' : ''}
                    <div className='text'> <p className='message-text'>{item.content}</p></div>
                  </div>
                )
              }
              
            })
          }

          {
            newarr.map((item, index) => {
              let img = Myurl;
              let classes = "message "
              let me = true;
              if(item.receiverid === localStorage.getItem("id") ){
                img = friend.url;
                classes = "message rtl" ;
                me = false
              }
              
              return (
                <div className={classes} key={index}>
                  <div className='image'><img src={img} alt="" /></div> {me ? ' (me) ' : ''}
                  <div className='text'> <p className='message-text'>{item.content}</p></div>
                </div>
              )
            })
          }
        </div >
      </div>
    </div>
  );
}