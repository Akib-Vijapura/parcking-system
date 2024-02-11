import connectDB from "@/lib/db";
import { setUserCookie, generateUserToken } from "@/lib/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  console.log("login POST route");
  await connectDB();

  try {
    const body = await request.json();
    console.log(body);
    const { username, password } = body;

    // check if the user already exists
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exists" },
        { status: 400 }
      );
    }

    // check if the password is correct

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 401 }
      );
    }

    // after we verified the user is valid, we can create a JWT token and return it to the user cookies
    // first create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const tmpUser = {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    // create a next response
    var response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
      token: await generateUserToken(tmpUser),
    });

    // set this token in the user cookies
    // response.cookies.set("token", token, { httpOnly: true });
    response = await setUserCookie(response, tmpUser);
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
