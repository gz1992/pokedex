import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest, ev: NextFetchEvent) {
	// console.log(req.url);
	const { pathname, origin } = req.nextUrl;
	// console.log(ev);
	// return early if url isn"t supposed to be protected
	// if (!req.url.includes('/protected-url')) {
	// 	const resp = NextResponse.next();
	// 	return resp;
	// }

	// const session = await getToken({ req, secret: process.env.SECRET });
	// You could also check for any property on the session object,
	// like role === "admin" or name === "John Doe", etc.
	const session = req.cookies.sessionid;
	console.log(req.cookies.sessionid);
	if (!session && pathname !== '/login') return NextResponse.redirect(`${origin}/login`);
	else if (session && pathname === '/login') return NextResponse.redirect(`${origin}/list`);
}
