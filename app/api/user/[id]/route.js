import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"


export async function PUT(req, { params }) {
  const id = params.id;
  const body = await req.json();

  try {
    const { username, password, windowNo } = body;

     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt);

     const user = await User.findOne({ username });
     if (user) {
       return NextResponse.json(
         { error: "User already exists" },
         { status: 400 }
       );
     }

    await User.findByIdAndUpdate(
      { _id: id },
      {
        username,
        password: hashedPassword,
        windowNo,
      }
    );

    const updatedUser = await User.findById({ _id: id });

    return NextResponse.json(
      {
        message: "success",
        user: updatedUser,
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


export async function DELETE(req, { params }) {
  // connectDB()
  const id = params.id;
  console.log("ID : ",id);
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if (!deletedUser) {
      return NextResponse.json(
        {
          message: "Cannot delete user",
        },
        {
          status: 402,
        }
      );
    }

    return NextResponse.json(
      {
        message: "user delete successfully",
        deletedUser,
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
