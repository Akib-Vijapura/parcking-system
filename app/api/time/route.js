// pages/api/time.js
import { NextResponse } from 'next/server';

export async function GET(req) {
    const newHeaders = new Headers(req.headers)
    newHeaders.set('Content-Type', 'text/plain')
    NextResponse.next({
        request: {
          // New request headers
          headers: newHeaders,
        },
    })
    return NextResponse.json({"time": new Date().toLocaleTimeString('en-US')});
}