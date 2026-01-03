import type { RouterClient } from "@orpc/server"

import { protectedProcedure, publicProcedure } from "../index"
import { reviewRouter } from "./review"
import { tmdbRouter } from "./tmdb"
import { userRouter } from "./user"

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK"
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    }
  }),
  review: reviewRouter,
  user: userRouter,
  tmdb: tmdbRouter,
}

export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
