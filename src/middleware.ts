// ./middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/webhooks/stripe", "/", "/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|/).*)", "/", "/(api|trpc)(.*)"],
};
