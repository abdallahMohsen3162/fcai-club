import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../firebase/clientApp";

async function addPost(userid: string, content: string, image: string) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      userid: userid,
      content: content,
      image: image,
      createdAt: new Date().toISOString() // Adding a timestamp
    });
    console.log("Post written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding post: ", e);
  }
}

export async function POST(req: NextRequest) {
  const { userid, content, url } = await req.json();
  try {
    const token = req.cookies.get("token")?.value;
    const user = await getDoc(doc(db, "users", userid));
    if(user.data()?.token != token){
      return NextResponse.json({ msg: "Failed" }, { status: 500 });
    }

    await addPost(userid, content, url);
    return NextResponse.json({ msg: "Success", userid, content, url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
// Define the interfaces for Post and User
interface Post {
  id: string;
  userid: string;
  content: string;
  image: string;
  createdAt: string;
  username?: string;  // Optional, to be added later
  userImage?: string; // Optional, to be added later
}

interface User {
  name: string;
  password: string;
  url: string; // Changed to url
}

// Function to get user details including image URL
async function getUserDetails(userid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (e) {
    console.log("Error getting user details: ", e);
    throw new Error("Error getting user details");
  }
}

// Function to get all posts and include user details
async function getAllPosts(): Promise<Post[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts: Post[] = [];
    
    for (const doc of querySnapshot.docs) {
      const post = { id: doc.id, ...doc.data() } as Post;
      const userDetails = await getUserDetails(post.userid);
      if (userDetails) {
        posts.push({
          ...post,
          username: userDetails.name,
          userImage: userDetails.url // Added URL here
        });
      } else {
        posts.push(post);
      }
    }
    
    return posts;
  } catch (e) {
    console.log("Error getting posts: ", e);
    throw new Error("Error getting posts");
  }
}

// Handler for GET requests to retrieve posts
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const posts = await getAllPosts();
    
    posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ msg: "Success", posts, str:token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ msg: "Success", posts: [] }, { status: 200 });
  }
}