import clientPromise from '../../../lib/mongodb';
import nodemailer from 'nodemailer';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your CS Rippers Registration OTP',
    html: `<div style="font-family:sans-serif;font-size:1.2rem"><b>Your OTP is:</b> <span style="font-size:2rem;color:#00b4db">${otp}</span><br/>Enter this to complete your registration.</div>`
  });
}

export async function POST(request) {
  const body = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db();
    const otp = generateOtp();
    const userData = { ...body, otp };
    let result;
    if (body.role === "student") {
      result = await db.collection("students").insertOne(userData);
    } else if (body.role === "member") {
      result = await db.collection("members").insertOne(userData);
    } else {
      return new Response(JSON.stringify({ success: false, error: "Invalid role" }), { status: 400 });
    }
    await sendOtpEmail(body.email, otp);
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 