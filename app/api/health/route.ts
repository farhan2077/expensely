import { NextResponse } from "next/server";
import { APP_NAME } from "@/config";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: `${APP_NAME} is working`,
  });
}
