import { NextResponse } from "next/server";

export default function middleware(req) {
  console.log(`middleware`);
  console.log("req = " + JSON.stringify(req));
}
