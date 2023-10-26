import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("auth_token")?.value || "";
    const decodedToken: any = jwt.verify(token, "122bhdbc");
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
