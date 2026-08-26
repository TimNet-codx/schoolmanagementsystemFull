import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

// const isProtectedRoute = createRouteMatcher([
//   "/admin",
//   "/teacher",
//   "/student",
//   "/parent",
//   "/list/teachers",
//   "/list/students",
//   "/list/parents",
//   "/list/subjects",
//   "/list/classes",
//   "/list/exams",
//   "/list/assignments",
//   "/list/results",
//   "/list/attendance",
//   "/list/events",
//   "/list/announcements",
//   "/list/lessons",
// ]);

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  //   if (isProtectedRoute(req)) {
  //     await auth.protect();
  //   }
  const { sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  // const name = (sessionClaims?.metadata as { name?: string })?.name;

  // console.log(name);

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
