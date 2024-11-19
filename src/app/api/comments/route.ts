import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";

async function addData(content: string, userId: string, postId: string) {
  try {
    const docRef = await addDoc(collection(db, "comments"), {
      content:  content,
      userId: userId,
      postId: postId
    });
    return docRef.id; // Return the document ID
  } catch (e) {
    console.log("Error adding document: ", e);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  const {content, userId, postId} = await req.json();
  try {
    await addData(content, userId, postId);
    return NextResponse.json({ msg: "Comment added",data:{content, userId, postId} }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

async function getUser(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("No such user!");
    }
  } catch (e) {
    console.log("Error fetching user: ", e);
    throw e;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  try {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const comments: Array<{ id: string, content: string, userId: string, postId: string, userImage: string }> = [];

    for (const doc of querySnapshot.docs) {
      const commentData = doc.data();
      if (postId === commentData.postId) {
        const user = await getUser(commentData.userId);
        comments.push({ id: doc.id, ...commentData, userImage: user.url } as { id: string, content: string, userId: string, postId: string, userImage: string });
      }
    }
    
    return NextResponse.json({ msg: "Comments fetched", comments }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const { commentId } = await req.json();

  try {
    // Construct the document reference for the comment to delete
    const commentRef = doc(db, "comments", commentId);

    // Delete the comment document from Firestore
    await deleteDoc(commentRef);

    return NextResponse.json({ msg: "Comment deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "An error occurred while deleting the comment" }, { status: 500 });
  }
}