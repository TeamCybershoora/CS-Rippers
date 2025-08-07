import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sendEmailWithRetry, emailTemplates } from '@/lib/email';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
  try {
    const template = emailTemplates.otp(otp, 'registration');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      html: template.html
    };
    
    await sendEmailWithRetry(mailOptions);
    console.log('✅ OTP email sent successfully to:', email);
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
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