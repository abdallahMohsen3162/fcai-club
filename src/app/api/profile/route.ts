import { collection, getDocs, DocumentData } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase/clientApp";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const allUsersSnapshot = await getDocs(collection(db, "users"));

    const users: DocumentData[] = [];
    let currentUser = null;
    
    allUsersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push(userData);
      if (userData.token === token) {
        currentUser = {
          ...userData,
          id: doc.id,
        };
        return;
      }
    });

    if (currentUser) {
      return NextResponse.json({ user: currentUser }, { status: 200 });
    } else {
      return NextResponse.json({ users: users }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "############" }, { status: 500 });
  }
}
