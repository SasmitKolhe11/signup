import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  const { email, otp } = await request.json();

  try {
    const result = await db.query(
      "SELECT * FROM otps WHERE email = $1 AND otp = $2 AND created_at > NOW() - INTERVAL '10 minutes'",
      [email, otp]
    );

    if (result.rows.length > 0) {
      // OTP is valid
      await db.query("DELETE FROM otps WHERE email = $1", [email]);
      return NextResponse.json(
        { message: "OTP verified successfully" },
        { status: 200 }
      );
    } else {
      // OTP is invalid or expired
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
