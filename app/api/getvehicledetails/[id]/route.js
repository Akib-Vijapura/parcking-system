import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Parking from "@/models/Parking";

export async function GET(req, { params }) {
  // Access the ID param from the context object
  await connectDB();
  const id = params.id;

  try {
    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      return NextResponse.json(
        { error: "Vehicle details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "succuess",
      vehicleDetails,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
