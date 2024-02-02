import connectDB from "@/lib/db";
import VehicleCharges from "@/models/VehicleCharges";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();

  try {
    const res = await VehicleCharges.find({});

    return NextResponse.json(
      {
        message: "success",
        res,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { twoWheeler, threeWheeler, fourWheeler, bus } = body;

    if (!twoWheeler || !threeWheeler || !fourWheeler || !bus) {
      return NextResponse.json(
        {
          message: "Please provide all filds",
        },
        {
          status: 401,
        }
      );
    }

    let exists = await VehicleCharges.exists({});
    let res;
    if (exists == null) {
      res = await VehicleCharges.create({
        twoWheeler,
        threeWheeler,
        fourWheeler,
        bus,
      });
    } else {
      res = await VehicleCharges.updateMany(
        {},
        {
          twoWheeler,
          threeWheeler,
          fourWheeler,
          bus,
        }
      );
    }

    return NextResponse.json(
      {
        message: "success",
        res,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}