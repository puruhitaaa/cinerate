import prisma from "@cinerate/db"
import z from "zod"

import { protectedProcedure, publicProcedure } from "../index"

export const userRouter = {
  // Get user profile with review count
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          createdAt: true,
          _count: { select: { reviews: true } },
        },
      })
      return user
    }),

  // Get current user's profile
  getMe: protectedProcedure.handler(async ({ context }) => {
    return await prisma.user.findUnique({
      where: { id: context.session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        createdAt: true,
        _count: { select: { reviews: true } },
      },
    })
  }),
}
