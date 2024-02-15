import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  connectDB();
  try {
    const users = await User.find({});
    //console.log(users);

    if (!users) {
      return NextResponse.json(
        {
          message: "users not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        message: "success",
        users,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
