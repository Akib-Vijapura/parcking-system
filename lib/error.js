import { NextResponse } from "next/server";

export async function exceptionHandler(req, status, message) {
    const base64 = btoa(JSON.stringify({ succes: false, status, message }));
    const rewrite = new URL(`/error/${base64}/`, req.url);
    return NextResponse.rewrite(rewrite);
}