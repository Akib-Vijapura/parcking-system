import connectDB from "@/lib/db";
import Parking from "@/models/Parking";
import { NextResponse } from "next/server";
//import { faker } from '@faker-js/faker';

import moment from 'moment';

// Function to get the start and end dates for a specific time period
const getStartAndEndDates = (unit, quantity) => {
  const endDate = moment().endOf('day');
  const startDate = moment().subtract(quantity, unit).startOf('day');
  return { startDate, endDate };
};

// Function to execute the aggregation query
const runAggregationQuery = async (startDate, endDate) => {
  try {
    const aggregationPipeline = [
      {
        $match: {
          dateTime: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: null,
          totalVehiclesParked: { $sum: 1 },
          totalRevenue: { $sum: '$vehicleCharge' },
        },
      },
    ];

    const result = await Parking.aggregate(aggregationPipeline);

    if (result.length === 0) {
      // If no matching records, return default values
      return [{ totalVehiclesParked: 0, totalRevenue: 0, startDate, endDate }];
    }

    return [{ ...result[0], startDate, endDate }];
  } catch (error) {
    // Handle the error, log it, and return default values
    console.log('Error in aggregation query:', error);
    return [{ totalVehiclesParked: 0, totalRevenue: 0, startDate, endDate }];
  }

};

// Function to generate fake parking data
const generateFakeParkingData = (count) => {
  const fakeData = [];
  for (let i = 0; i < count; i++) {
    fakeData.push({
      vehicleNumber: faker.vehicle.vrm(),
      vehicleType: faker.helpers.arrayElement(['TWO', 'THREE', 'FOUR', 'BUS']),
      vehicleCharge: faker.number.int({ min: 20, max: 100 }),
      dateTime: faker.date.between( { from: moment().subtract(1, 'year').toDate(), to: new Date()} ),
    });
  }
  return fakeData;
};

// Function to generate fake parking data for today
const generateFakeParkingDataForToday = (count) => {
  const fakeData = [];
  const today = moment().startOf('day');

  for (let i = 0; i < count; i++) {
    fakeData.push({
      vehicleNumber: faker.vehicle.vrm(),
      vehicleType: faker.helpers.arrayElement(['TWO', 'THREE', 'FOUR', 'BUS']),
      vehicleCharge: faker.number.int({ min: 20, max: 100 }),
      dateTime: today.toDate()
    });
  }

  return fakeData;
};

// Function to dump fake data into the Parking model
const dumpFakeParkingData = async (data) => {
  try {
    await Parking.insertMany(data);
    console.log('Fake data dumped successfully!');
  } catch (error) {
    console.error('Error dumping fake data:', error);
  }
};


export async function GET(req,res) {
  await connectDB();

  try {

    // Usage
// const monthOldData = generateFakeParkingData(100); // Change the count as needed
// const quarterOldData = generateFakeParkingData(200);
// const yearOldData = generateFakeParkingData(300);
// const todaysData = generateFakeParkingDataForToday(100);

// Uncomment and run this to insert fake data into the database
// dumpFakeParkingData(monthOldData);
//  dumpFakeParkingData(quarterOldData);
//  dumpFakeParkingData(yearOldData);
//  dumpFakeParkingData(todaysData)


    // Last Month
const { startDate: lastMonthStart, endDate: lastMonthEnd } = getStartAndEndDates('months', 1);
var lastMonthData = await runAggregationQuery(lastMonthStart, lastMonthEnd);

// Last Quarter
const { startDate: lastQuarterStart, endDate: lastQuarterEnd } = getStartAndEndDates('quarters', 1);
var lastQuarterData = await runAggregationQuery(lastQuarterStart, lastQuarterEnd);

// Last Year
const { startDate: lastYearStart, endDate: lastYearEnd } = getStartAndEndDates('years', 1);
var lastYearData = await runAggregationQuery(lastYearStart, lastYearEnd);

// Today
const { startDate: todayStart, endDate: todayEnd } = getStartAndEndDates('days', 0);
var todaysData = await runAggregationQuery(todayStart, todayEnd);

    // console.log('Last Month Data:', lastMonthData);
    // console.log('Last Quarter Data:', lastQuarterData);
    // console.log('Last Year Data:', lastYearData);
    // console.log('Today\'s Data:', todayData);

    //console.log('Types Count:', entriesForToday);
    return NextResponse.json({
      todaysData: todaysData,
      lastMonthData: lastMonthData,
      lastQuarterData: lastQuarterData,
      lastYearData: lastYearData
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
