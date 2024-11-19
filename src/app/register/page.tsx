"use client"
import React, { useEffect, useState } from 'react'
import "./register.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faJoint, faRegistered, faSignIn, faX } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { faCertificate } from '@fortawesome/free-solid-svg-icons/faCertificate'
import { uploadImage } from '../../../firebase/uploadImage'

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


const default_image = 'https://th.bing.com/th/id/OIP.a0fXJrzXJpGEYAKBhfqxOAHaEq?rs=1&pid=ImgDetMain';
export default function Page() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState('')
  const [errType, setErrType] = useState('')



 

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0])
  }

  const handleUpload = async () => {

    if(isValidEmail(email) === false){
      setErrType('Not an email')
      return;
    }
    
    if (!name || !password) {
      setErrType('Please enter name and password')
      return;
    }

    if(password.length < 8){
      setErrType('Password must be at least 8 characters')
      return;
    }
    
    setLoading(true)
    setUploading(true)
    try {
      let imageUrl = '';
      if(file){
        imageUrl = await uploadImage(file)
      }else{
        imageUrl = default_image;
      }
      setUrl(imageUrl)

      const response = await fetch('/api/createuser', {
        method: 'POST',
        body: JSON.stringify({ email,name, password, url: imageUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log(data);
      
      if (data.user) {

        // await sendMail();
        localStorage.setItem('id', data.id)
        setUploading(false)
        router.push('/')
        setLoading(false)
        const x = window.location 
        window.location = x;
      }else{
        alert('username exists')
        setUploading(false)
        setLoading(false)
      }
    } catch (error) {
      alert('Error uploading file')
      setUploading(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('id')) {
      router.push('/')
    }
  }, [])



  return (
    <div className='register'>
      <h1 className=''> Register</h1>

      <input 
        type="email" 
        placeholder="البريد الالكتروني"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <input 
        type="text" 
        placeholder="اسم المستخدم"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <input 
        type="password"
        placeholder="كلمة المرور"
        onChange={(e) => setPassword(e.target.value)} 
        value={password}
      />

      <input type="file" onChange={handleFileChange} />

      <button type='submit' onClick={handleUpload} className='btn btn-login'>
        Register
      </button>
      <br />
      <Link href={'/login'}>
        login
      </Link>
      <p className='error'>{errType}</p>
    </div>
  )
}
