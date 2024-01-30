import connectDB from "@/lib/db";
import Parking from "@/models/Parking";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const allVehicles = await Parking.find({});

    return NextResponse.json({
      message: "succuess",
      vehicles: allVehicles
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
