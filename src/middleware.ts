import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "./app/auth.config"
const { auth } = NextAuth(authConfig)


async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    response.headers.set("x-current-url", request.nextUrl.href)
    response.headers.set("x-current-pathname", request.nextUrl.pathname)
    response.headers.set("x-current-query", request.nextUrl.searchParams.toString())
    return response
}


export default auth(middleware)
export const config = {
    matcher: "/:path*",
}
