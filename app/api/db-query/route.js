import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  const { query, params } = await request.json();

  try {
    console.log("Executing query:", query);
    const result = await db.query(query, params);
    console.log("Query result:", result.rows);
    return NextResponse.json({ result: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
