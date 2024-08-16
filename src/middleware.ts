import {apiAuthPrefix, authRoutes, Route} from '../routes';
import {NextResponse} from 'next/server';
import {auth} from '../auth';

export default auth(req => {
  const {nextUrl} = req;
  const isAuth = !!req.auth;

  const isApiAuthURL = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthURL) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isAuth) {
      return Response.redirect(new URL(Route.MAIN));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.searchParams) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`${Route.SIGN_IN}?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
