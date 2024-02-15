import { NextResponse } from "next/server";
import { verifyAuth, isAdmin } from "@/lib/auth";


// This function can be marked `async` if using `await` inside
export async function middleware (request ,response) {
  // there are some public paths and there are some protected paths
  // the public path should not be visible when the user has the token
  // the private path should not be visible when the user doesn't have the token
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";

  const token = request.cookies.get("token")?.value || ""; // check if the token exists

   // validate the user is authenticated
   const verifiedToken = await verifyAuth(request);
  
    //validate the user is authorized
  if(verifiedToken == null) {
    console.log("token verification failed")
    expireUserCookie(response)
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  const isAdmin_ = isAdmin(verifiedToken);
  console.log("isAdmin_ = ", isAdmin_)

  //https://nextjs.org/docs/messages/returning-response-body-in-middleware
  //https://medium.com/sopra-steria-norge/how-to-write-actual-api-middleware-for-next-js-2a38355f6674
  if(path.startsWith("/admin") && isAdmin_) {
    console.log("admin is allowed for this route")
    return NextResponse.next()
  } else if(path.startsWith("/admin") && !isAdmin_) {
    console.log("ACCESS DENIED: only admin is allowed for this route")
    //let response = NextResponse.json({error: "ACCESS DENIED: only admin is allowed for this route"}, {status: 301}) //301 -> redirect
    //console.log("DENIED response1 = ", response)
    //return response;
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  /*
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
  */
 
}

//For our use case, we are only defining three routes that will trigger this middleware: /profile, /login, /sign-up
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/client", "/admin", "/admin/:path*", "/client/:path*"],
};