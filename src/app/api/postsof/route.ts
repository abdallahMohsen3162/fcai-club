import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";

// Define the Post type if not already defined
type Post = {
  id: string;
  content: string;
  createdAt: string;
  image: string;
  userid: string;
  username: string;
};

export async function POST(req: NextRequest) {
  const {id} = await req.json()
  try {
    // const id = "TZhfLduixIJaOiaGa8ML";
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts: Post[] = [];

    querySnapshot.forEach((doc) => {
      if (id === doc.data().userid) {
        posts.push({ id: doc.id, ...doc.data() } as Post);
      }
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching posts." }, { status: 500 });
  }
}
