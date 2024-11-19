import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/clientApp";
import jwt from 'jsonwebtoken';

import {updateUserToken} from "../../../../helpers/tokens";



export async function POST (req: NextRequest) {
  const {name, password, email} = await req.json()
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<{ id: string, name: string, password: string, email:string }> = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as { id: string, name: string, password: string, email:string});
    });

    for (let i = 0; i < users.length; i++) {
      if (users[i].password === password && (users[i].name === name || users[i].email === email)) {
        const tokenData = {
          'name': name
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY!, {expiresIn: "1d"})
        updateUserToken(users[i].id, token)
        const response = NextResponse.json({
          'message': "Login successful",
          'success': true,
          'user':users[i]
        })

        response.cookies.set("token", token, {
          httpOnly: true, 
        })
        
        return response
      }
    }

    return NextResponse.json({users: null}, {status:200})
      
  } catch (error) {
    return NextResponse.json({error:"############"})
  }

}