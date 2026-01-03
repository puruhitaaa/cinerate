import prisma from "@cinerate/db"
import { ORPCError } from "@orpc/server"
import z from "zod"

import { protectedProcedure, publicProcedure } from "../index"

export const reviewRouter = {
  // Get all reviews for a specific movie
  getByMovie: publicProcedure
    .input(z.object({ tmdbMovieId: z.number().int() }))
    .handler(async ({ input }) => {
      return await prisma.review.findMany({
        where: { tmdbMovieId: input.tmdbMovieId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }),

  // Get all reviews by a specific user
  getByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .handler(async ({ input }) => {
      return await prisma.review.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      })
    }),

  // Get current user's reviews
  getMyReviews: protectedProcedure.handler(async ({ context }) => {
    return await prisma.review.findMany({
      where: { userId: context.session.user.id },
      orderBy: { createdAt: "desc" },
    })
  }),

  // Create a new review
  create: protectedProcedure
    .input(
      z.object({
        tmdbMovieId: z.number().int(),
        rating: z.number().int().min(1).max(5),
        content: z.string().max(2000).optional(),
        containsSpoilers: z.boolean(),
      })
    )
    .handler(async ({ input, context }) => {
      // Check if user already reviewed this movie
      const existing = await prisma.review.findUnique({
        where: {
          userId_tmdbMovieId: {
            userId: context.session.user.id,
            tmdbMovieId: input.tmdbMovieId,
          },
        },
      })

      if (existing) {
        throw new ORPCError("CONFLICT", {
          message: "You have already reviewed this movie",
        })
      }

      return await prisma.review.create({
        data: {
          ...input,
          userId: context.session.user.id,
        },
      })
    }),

  // Update own review
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        rating: z.number().int().min(1).max(5).optional(),
        content: z.string().max(2000).optional(),
        containsSpoilers: z.boolean().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const review = await prisma.review.findUnique({
        where: { id: input.id },
      })

      if (!review || review.userId !== context.session.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "Cannot update this review",
        })
      }

      const { id, ...data } = input
      return await prisma.review.update({
        where: { id },
        data,
      })
    }),

  // Delete own review
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const review = await prisma.review.findUnique({
        where: { id: input.id },
      })

      if (!review || review.userId !== context.session.user.id) {
        throw new ORPCError("FORBIDDEN", {
          message: "Cannot delete this review",
        })
      }

      return await prisma.review.delete({
        where: { id: input.id },
      })
    }),
}
