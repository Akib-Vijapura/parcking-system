import { NextResponse } from "next/server";


// This function can be marked `async` if using `await` inside
export function middleware(request) {

  // there are some public paths and there are some protected paths
  // the public path should not be visible when the user has the token
  // the private path should not be visible when the user doesn't have the token

  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";
  console.log("middlware called for path=", path)

  const token = request.cookies.get("token")?.value || ""; // check if the token exists

  if (isPublicPath && token.length > 0) {
    console.log('11111')
    // redirect them to their profile page
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  if (!isPublicPath && !token.length > 0) {
    console.log('22222')
    // redirect them to the login page
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

//For our use case, we are only defining three routes that will trigger this middleware: /profile, /login, /sign-up
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/client", "/admin"],
};