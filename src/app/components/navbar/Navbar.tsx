"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowAltCircleDown, faBars, faDna, faFileArchive, faHome, faMessage, faOutdent, faPooStorm, faSign, faSignIn, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import { faAd } from '@fortawesome/free-solid-svg-icons/faAd';
import { useRouter } from 'next/navigation';
import { deleteCookie } from '../../../../helpers/tokens';
import swal from 'sweetalert';

export default function Navbar() {
  const router = useRouter();
  const [id, setid] = useState("");
  const logout = () => {


    swal("Logging out?")
    .then(async (value) => {
      if(value){
        await fetch('/api/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((res) => res.json()).then((data) => {
          console.log(data);
          
          setid("");
          router.push('/login');
          localStorage.setItem('id', "");
        })
      }
    });
    
    
    
    
  }

  

  useEffect(() => {

    const i = localStorage.getItem('id');
    if(i)
      setid(i);

    return () => {
      setid("");
    }
  }, [id])
  return (
    <div className="sidebar">
      <nav>
        <ul className="sidebar-list">
          {
            id ? (
            <li className="sidebar-item">
              <Link href="/">
                <FontAwesomeIcon icon={faHome} />
              </Link>
            </li>
            ) : (
              ""
            )
          }

         {
           id ? (
             <li className="sidebar-item">
               <Link href="/post">
                 <FontAwesomeIcon icon={faAdd} />
               </Link>
             </li>
           ) : (
             ""
           )
         }
         {
           id ? (
             <li className="sidebar-item">
               <Link href="/chat">
                 <FontAwesomeIcon icon={faMessage} />
               </Link>
             </li>
           ) : (
             ""
           )
         }

          {id && (
            <li className="sidebar-item">
            <Link href={`/profile`}>  
              <FontAwesomeIcon icon={faUser} />
             </Link>
          </li>
          )}
          
          {(id) ?(
            <li className="sidebar-item ">
              <button  onClick={() =>{logout(); logout()}}  className='btn btn-logout'>
              <FontAwesomeIcon icon={faSignOut} />
              </button>
            </li>
          ) : (
            <li className="sidebar-item">
              <Link href={"/login"} className='btn btn-logout'>
                login
              </Link>
              <br />
              <Link href={"/register"} className='btn btn-logout'>
               +Join
              </Link>
            </li>
          )}
      
    
        </ul>
        
      </nav>
    </div>
  );
}
