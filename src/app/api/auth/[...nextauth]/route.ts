/**
 * app/api/auth/[...nextauth]/route.ts
 * NextAuth.js Route Handler
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
