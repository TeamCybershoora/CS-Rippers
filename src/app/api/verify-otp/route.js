import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  const { userId, otp } = await request.json();
  try {
    const client = await clientPromise;
    const db = client.db();
    let user = await db.collection("students").findOne({ _id: new ObjectId(userId), otp });
    let collection = "students";
    if (!user) {
      user = await db.collection("members").findOne({ _id: new ObjectId(userId), otp });
      collection = "members";
    }
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Invalid OTP" }), { status: 401 });
    }
    await db.collection(collection).updateOne({ _id: new ObjectId(userId) }, { $unset: { otp: "" } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 