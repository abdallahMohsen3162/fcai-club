import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";

export async function DELETE(req: NextRequest) {
  const { postid } = await req.json();
  try {
    const postRef = doc(db, "posts", postid);
    await deleteDoc(postRef);

    return NextResponse.json(
      { msg: "Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Deleting error" },
      { status: 500 }
    );
  }
}
