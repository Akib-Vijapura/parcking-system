import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyAuthWithToken, isAdmin } from "@/lib/auth";


export async function POST(request) {
    console.log("verify POST route")
    try {
        const body = await request.json();
        const {token} = body;
        //console.log("token=", token)


        var tokenPayload;
        const isVerified = await verifyAuthWithToken(token, tokenPayload);
        //console.log("isVerified=", isVerified)
        if(isVerified == 0) {
            return NextResponse.json({message: "Token expired"}, {status: 401});
        }

        const isAdmin_ = isAdmin(tokenPayload);

        return NextResponse.json({message: "Token is good", success: true, redirect: isAdmin_ ? "/admin": "/client"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
    return request;
}