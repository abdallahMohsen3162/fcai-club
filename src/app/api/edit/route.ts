import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";

export async function PUT(req: NextRequest) {
  const { id, name, url } = await req.json();
  const users = await getDocs(collection(db, "users"));
  try {
    // return NextResponse.json({ data: { id, name, url },message: "User updated successfully" }, { status: 200 });
    const userDoc = doc(db, "users", id);

    const updateData :any= {};
    let exists = false;
    let arr : any[] = [];
    let msg = "Username exists";
    if (name && name != '' && name != ' '){
      
      users.forEach((user) => {
        arr.push({id: user.id,...user.data()});
      })

    for (let i = 0; i < arr.length; i++) {
      if(arr[i].name == name && arr[i].id != id){
        exists = true;
      } 
    }
  }
  
  if(!exists){
    updateData.name = name;
    msg = "User updated successfully";
  }

    if (url) updateData.url = url;
    
    await updateDoc(userDoc, updateData);

    return NextResponse.json({ message:msg}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}
