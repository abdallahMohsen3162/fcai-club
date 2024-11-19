import { addDoc, collection, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";
import jwt from 'jsonwebtoken';

async function addData(name: string, pass: string, url: string, token: string, email: string) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: name,
      password: pass,
      url: url,
      token: token,
      email: email
    });
    return docRef.id; // Return the document ID
  } catch (e) {
    console.log("Error adding document: ", e);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const { name, password, url, email } = await req.json();
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<{ id: string, name: string, password: string }> = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as { id: string, name: string, password: string });
    });

    for (let i = 0; i < users.length; i++) {
      if (users[i].name === name) {
        return NextResponse.json({ msg: "User already exists", user: null }, { status: 400 });
      }
    }


    
    const tokenData = {
      name: name
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY!, { expiresIn: "1d" });
    const newUserId = await addData(name, password, url, token, email); // Get the new user ID
    const response = NextResponse.json({
      message: "Registration successful",
      success: true,
      user: { name, password, url },
      id: newUserId // Include the new user ID in the response
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
