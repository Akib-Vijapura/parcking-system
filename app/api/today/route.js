import connectDB from "@/lib/db";
import Parking from "@/models/Parking";
import { NextResponse } from "next/server";

const getEntriesForToday = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const entries = await Parking.find({
        dateTime: { $gte: today },
      });
  
      return entries;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

const groupEntriesByWindowNo = (entries) => {
    const groupedEntries = {};
  
    entries.forEach((entry) => {
      const windowNo = entry.windowNo;
  
      if (!groupedEntries[windowNo]) {
        groupedEntries[windowNo] = [];
      }
  
      groupedEntries[windowNo].push(entry);
    });
  
    return groupedEntries;
  };
  


export async function GET(req,res) {
  await connectDB();

  try {

    const todaysEntries = await getEntriesForToday();

    /*const todaysEntries = [
        {
        "_id": "65d1aba42efe7fa8cb451a42",
        "vehicleNumber": "GJ09BC3449",
        "vehicleType": "THREE",
        "vehicleCharge": 20,
        "dateTime": "2024-02-18T07:01:20.459Z",
        "windowNo": 1,
        "__v": 0
        },
        {
        "_id": "65d1aeffe03303de63ef1a85",
        "vehicleNumber": "GJ09BC3449",
        "vehicleType": "THREE",
        "vehicleCharge": 20,
        "dateTime": "2024-02-18T07:17:18.723Z",
        "windowNo": 2,
        "__v": 0
        },
        {
        "_id": "65d1af0ee03303de63ef1a88",
        "vehicleNumber": "GJ09BC3449",
        "vehicleType": "THREE",
        "vehicleCharge": 20,
        "dateTime": "2024-02-18T07:17:18.723Z",
        "windowNo": 3,
        "__v": 0
        },
        {
        "_id": "65d1af16e03303de63ef1a8b",
        "vehicleNumber": "GJ09BC3449",
        "vehicleType": "THREE",
        "vehicleCharge": 20,
        "dateTime": "2024-02-18T07:17:18.723Z",
        "windowNo": 1,
        "__v": 0
        },
        {
        "_id": "65d1af4ee03303de63ef1a8e",
        "vehicleNumber": "SADASD",
        "vehicleType": "THREE",
        "vehicleCharge": 20,
        "dateTime": "2024-02-18T07:17:18.723Z",
        "windowNo": 2,
        "__v": 0
        }
    ]*/

    const groupedEntries = groupEntriesByWindowNo(todaysEntries);

    //console.log('Grouped Entries:', groupedEntries);

    return NextResponse.json({
        //todaysEntries,
        groupedEntries
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
