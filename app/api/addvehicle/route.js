import connectDB from "@/lib/db";
import Parking from "@/models/Parking";
import { NextResponse } from "next/server";
import VehicleCharges from "@/models/VehicleCharges";

const getVehicleCharge = async (vehicleType) => {
  let vehicleCharge = 0;
  try {
    const res = await VehicleCharges.find({});
    const data = res[0];
    console.log("getvehiclecharge data ==> ", data, " ", vehicleType);
    if (vehicleType === "TWO") {
      vehicleCharge = data.twoWheeler;
    } else if (vehicleType === "THREE") {
      vehicleCharge = data.threeWheeler;
    } else if (vehicleType === "FOUR") {
      vehicleCharge = data.fourWheeler;
    } else if (vehicleType === "BUS") {
      vehicleCharge = data.bus;
    }
  } catch (err) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    return vehicleCharge;
  }
};
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
    var vehicleCharge = await getVehicleCharge(vehicleType);
    console.log("vehicleCharge ===> ", vehicleCharge);

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
