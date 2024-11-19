
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../../firebase/clientApp';

const MailHtml = (password:string, username:string) => {
  return `
  <p> Your password is <strong>${password}</strong> and username is <strong>${username}</strong> </p>
  <p>Thanks for joining us!</p>
  `
}



export async function POST(req: NextRequest) {
  const {reciever} = await req.json();
  try {
    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP server host
      port: parseInt(process.env.SMTP_PORT!, 10), // SMTP server port
      secure: process.env.SMTP_SECURE === 'true', // Use SSL
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });
    let users = await getDocs(collection(db, "users"));
    let password = "not found";
    let username = 'not found';
    users.forEach((user) => {
      if(user.data().email == reciever){
        password = user.data().password
        username = user.data().name
      }
    })
    // Setup email data 
    let mailOptions = {
      from: `"Your Name and password" <fcai-club>`, // Sender address
      to:reciever, // List of recipients
      subject: "Password", // Subject line
      text: `Your password is ${password} and username is ${username}`, // Plain text body
      html: MailHtml(password, username), // HTML body content
    };
    // return NextResponse.json({ msg: "Email sent successfully" }, { status: 200 });
    
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ msg: "Email sent successfully" ,info}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
