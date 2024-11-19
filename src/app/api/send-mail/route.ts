

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const MailHtml = (name:string) => {
  return `<h1>Registerd succesfully to fcai-club ${name}!</h1>

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
    
    // Setup email data 
    let mailOptions = {
      from: `"Your Name" <fcai-club>`, // Sender address
      to:reciever, // List of recipients
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // Plain text body
      html: MailHtml(reciever), // HTML body content
    };
    
    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ msg: "Email sent successfully" ,info}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
