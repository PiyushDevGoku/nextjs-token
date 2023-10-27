import { NextRequest, NextResponse } from "next/server";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const authorizationHeader = request?.headers.get("Authorization");

  if (!authorizationHeader) {
    return NextResponse.json(
      { error: "Authorization header is missing" },
      { status: 400 }
    );
  }

  const token = authorizationHeader.replace("Bearer ", "");
  console.log("old token------->", token);
  try {
    const decodedToken: any = jwt.verify(token, "122bhdbc");
    const { email } = decodedToken;
    console.log("email------->", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      const newToken = jwt.sign({ email: user.email }, "122bhdbc", {
        expiresIn: "5m",
      });
      console.log("new token------->", newToken);
      return NextResponse.json({ newToken }, { status: 200 });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Token Verification Error:", error.message);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
