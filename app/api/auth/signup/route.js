import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import db from "@/lib/db";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const { name, email } = await request.json();

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    // Store OTP in PostgreSQL
    await db.query(
      "INSERT INTO otps (email, otp, created_at) VALUES ($1, $2, NOW())",
      [email, otp]
    );

    // Send email
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for signup",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: `<b>Your OTP is ${otp}. It will expire in 10 minutes.</b>`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in signup process:", error);
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 }
    );
  }
}
