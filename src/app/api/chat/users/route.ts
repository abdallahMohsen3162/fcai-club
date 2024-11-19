import { collection, getDocs } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../../firebase/clientApp";

export async function POST() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<{ id: string, url: string, name: string }> = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({ id: doc.id, url: userData.url, name: userData.name });
    });

    const response = NextResponse.json(
      { users }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        }
      }
    );

    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: "An error occurred while processing your request." }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        }
      }
    );

    return response;
  }
}