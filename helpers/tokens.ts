import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/clientApp";


export async function updateUserToken(userId:string, newToken:string) {
  // Find the user document by ID
  const userRef = doc(db, "users", userId);
  // Update the "token" column with newToken
  await updateDoc(userRef, { token: newToken });
}



export const deleteCookie = (name: string, path: string = "/", domain?: string) => {
  let cookieString = `${name}=; Max-Age=0; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  document.cookie = cookieString;
};