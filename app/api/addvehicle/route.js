import connectDB from "@/lib/db";
import Parking from "@/models/Parking";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const { vehicleNumber, vehicleType } = body;
    const vehicleNumberToUpper = vehicleNumber.toUpperCase();
    if (!vehicleNumberToUpper || !vehicleType) {
      return NextResponse.json(
        { error: "Please provide all the fields" },
        { status: 401 }
      );
    }
    var vehicleCharge;
    if (vehicleType === "TWO") {
      vehicleCharge = 30;
    } else if (vehicleType === "THREE") {
      vehicleCharge = 50;
    } else if (vehicleType === "FOUR") {
      vehicleCharge = 80;
    } else if (vehicleType === "BUS") {
      vehicleCharge = 110;
    }

    const vehicle = await Parking.create({
      vehicleNumber: vehicleNumberToUpper,
      vehicleType,
      vehicleCharge,
    });

    console.log("before next req 2");
    return NextResponse.json({
      message: "succuess",
      vehicle,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
