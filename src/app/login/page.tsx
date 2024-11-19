"use client"
import React, { useEffect, useState } from 'react'
import "./login.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignIn, faX } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'



export default function Page() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [id, setid] = useState("");
  const [forget, setforget] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const router = useRouter()

  const sendMail = async () => {
    if(!forgotEmail){
      return;
    }
    setLoading(true)
    await fetch('/api/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reciever: forgotEmail
      }),
    })
      .then((res) => res.json())
      .then((res) => {console.log(res);
        setLoading(false)})
      .catch((error) => console.error('Error:', error));
  }

  const login = async () => {
    setLoading(true)
    if (!name || !password) {
      setLoading(false)
      return  
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ name, password, email }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log(data);
      
      if (data.user) {
        console.log(data.user);
        
        localStorage.setItem('id', data.user.id)
        setLoading(false)
        router.push('/')
        let x = window.location
        window.location = x;
      } else {
        // Handle login failure (optional)
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('id', '')
    //reload page
    console.log("dddddddddddddddddddd");
    
  }, [id])

  return (
    <div className='login'>
      <h1 className=''> Login</h1>

      
      <input 
        type="text" 
        placeholder="اسم المستخدم او البريد الالكتروني"
        onChange={(e) => {setName(e.target.value); setEmail(e.target.value)}}
        value={name}
      />

      <input 
        type="password"
        placeholder="كلمة المرور"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button onClick={login} className='btn btn-login'>
        {loading ? <div className='spinner'></div> : 'login'}
      </button>

      <br />
      <button 
      type='button'
      style={{padding: '10px 20px', borderRadius: '5px', color: 'white', border: 'none', cursor: 'pointer'}}
      onClick={() => setforget(true)}
      className='btn p-3'>
        Forgot password
      </button>

      {forget && <div className='forget'>
          <button 
            onClick={() => setforget(false)}
            className='btn btn-login'>
            <FontAwesomeIcon icon={faX} />
          </button>
          <input 
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          type="email" 
          placeholder='البريد الالكتروني' />
          <button 
          
          onClick={sendMail}
          className='btn btn-login'>
            {loading ? <div className='spinner-dark'></div> : 'send mail'}
          </button>
        </div>}

        <br />
        <Link href="/register">register</Link>
    </div>
  )
}
