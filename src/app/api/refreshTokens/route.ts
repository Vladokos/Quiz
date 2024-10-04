import { NextResponse } from "next/server";

import cookie from "cookie";

import { findUserByEmail, newTokens } from "@/lib/db/dbQueries";

export const POST = async (request: Request) => {
  try {
    const { email } = await request.json();
    const user = await findUserByEmail(email);
    if (user) {
      
      const tokens = await newTokens(user.Email);
      
      return NextResponse.json({msg: "success", status: 200, tokens});
    }

    throw Error;
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
};
