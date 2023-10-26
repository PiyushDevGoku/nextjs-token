import { NextResponse, NextRequest } from "next/server";
import { signOut } from "next-auth/react";
export async function GET(request: NextRequest) {
  try {
    await await signOut({ callbackUrl: "/login" });
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
