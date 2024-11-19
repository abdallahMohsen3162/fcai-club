import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";



export async function GET(req: NextRequest){
  // const {name, password} = await req.json()
 try {    
    const token = req.cookies.get("token")?.value;
    const user = await getDoc(doc(db, "users", "m9Y3xHrMsq0pB8NP2773"));
    if(user.data()?.token != token){
      return NextResponse.json({ msg: "Failed" }, { status: 500 });
    }
   
  return NextResponse.json({users: user.data()}
  , {status:200})
 } catch (error) {
  return NextResponse.json({error:"############"}
            , {status:500})
 }
}


