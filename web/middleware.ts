import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// One address for one page.
// Vercel also serves this deployment on generated hosts such as
// <project>-<account>.vercel.app and <project>-git-<branch>-<account>.vercel.app.
// Those return the identical document, which splits inbound links and lets a
// reader cite a URL that is not the one referenced in the repository.
// Any non-canonical host is answered with a permanent redirect instead.
const CANONICAL_HOST = "memory-firewall-lab.vercel.app";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  if (!host || host === CANONICAL_HOST || host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return NextResponse.next();
  }
  const target = new URL(request.nextUrl.toString());
  target.host = CANONICAL_HOST;
  target.protocol = "https:";
  target.port = "";
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
