import { NextRequest, NextResponse } from "next/server";
import { db } from "../firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";
import UAParser from 'ua-parser-js';
async function tokenExistsInDb(token:string) {
  if(!token){
    return false  
  }
  const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<{ id: string, name: string, password: string }> = [];
    querySnapshot.forEach((doc) => {
      if(doc.data().token == token){
        return true;
      }
    });
  return false;
}


export function middleware(request : NextRequest) {

  // const uaParser = new UAParser();
  // const userAgent = request.headers.get('user-agent') || '';
  // const result = uaParser.setUA(userAgent).getResult();

  // if (result.device.type === 'mobile') {
  //   return new NextResponse('Mobile access is blocked.', { status: 403 });
  // }

    
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value

  if(path == "/" && !token){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if(path == "/login" && token){
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(path == "/register" && token){
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(path == "/post" && !token){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if(path == "/profile" && !token){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if(path == "/chat" && !token){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/post", '/profile', '/chat'],
}