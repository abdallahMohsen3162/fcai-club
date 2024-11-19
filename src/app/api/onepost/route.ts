import { NextRequest, NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/clientApp";

export async function GET(req: NextRequest) {

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);
    const userid = postSnap.data()?.userid
    const user = await getDoc(doc(db, "users", userid));
    if (postSnap.exists()) {
      return NextResponse.json({ post: postSnap.data(), user : {name : user.data()?.name, url : user.data()?.url} }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}
