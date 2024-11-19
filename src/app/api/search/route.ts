import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";




export async function GET(req: NextRequest){
  // const {name, password} = await req.json()
 try {
  const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<{ id: string, name: string, password: string }> = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as { id: string, name: string, password: string });
    });
    
    // for (let i = 0; i < users.length; i++) {
    //   if(){

    //   }
    // }
   
  return NextResponse.json({users: users}
  , {status:200})
 } catch (error) {
  return NextResponse.json({error:"############"}
            , {status:500})
 }
}



