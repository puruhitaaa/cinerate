import { expo } from "@better-auth/expo"
import prisma from "@cinerate/db"
import { env } from "@cinerate/env/server"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { username } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [env.CORS_ORIGIN, "mybettertapp://", "exp://"].filter(
    Boolean
  ),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [expo(), username({ minUsernameLength: 6, maxUsernameLength: 20 })],
})
