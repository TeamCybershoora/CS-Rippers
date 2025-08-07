import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sendEmailWithRetry, emailTemplates } from '@/lib/email';
import { ObjectId } from 'mongodb';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email, otp) {
  try {
    const template = emailTemplates.otp(otp, 'login');
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
  const { email, mobile, password } = body;
  if (!((email || mobile) && password)) {
    return new Response(JSON.stringify({ success: false, error: 'Email/Mobile and password required' }), { status: 400 });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    let user = null;
    let collection = '';
    if (email) {
      user = await db.collection('students').findOne({ email });
      collection = 'students';
      if (!user) {
        user = await db.collection('members').findOne({ email });
        collection = 'members';
      }
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'Email does not exist' }), { status: 404 });
      }
    } else if (mobile) {
      user = await db.collection('students').findOne({ mobile });
      collection = 'students';
      if (!user) {
        user = await db.collection('members').findOne({ mobile });
        collection = 'members';
      }
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: 'Mobile number does not exist' }), { status: 404 });
      }
    }
    if (user.password !== password) {
      return new Response(JSON.stringify({ success: false, error: 'Incorrect password' }), { status: 401 });
    }
    // Generate OTP and update user
    const otp = generateOtp();
    await db.collection(collection).updateOne({ _id: new ObjectId(user._id) }, { $set: { otp } });
    await sendOtpEmail(user.email, otp);
    return new Response(JSON.stringify({ success: true, userId: user._id }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 