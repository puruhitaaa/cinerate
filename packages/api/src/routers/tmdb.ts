import { env } from "@cinerate/env/server"
import z from "zod"

import { publicProcedure } from "../index"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"

async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const apiKey = env.TMDB_API_KEY.trim()
  const isV3 = apiKey.length === 32

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (isV3) {
    url.searchParams.append("api_key", apiKey)
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`
  }

  const res = await fetch(url.toString(), {
    headers,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(
      `TMDB API error: ${res.status} ${JSON.stringify(errorBody)}`
    )
  }

  return res.json() as Promise<T>
}

// TMDB API response types
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface TMDBMovieListResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[]
  runtime: number
  tagline: string
  status: string
  credits?: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
    crew: {
      id: number
      name: string
      job: string
      profile_path: string | null
    }[]
  }
}

export const tmdbRouter = {
  // Get trending movies
  trending: publicProcedure
    .input(
      z
        .object({
          timeWindow: z.enum(["day", "week"]).default("week"),
        })
        .optional()
    )
    .handler(async ({ input }) => {
      const timeWindow = input?.timeWindow ?? "week"
      return await tmdbFetch<TMDBMovieListResponse>(
        `/trending/movie/${timeWindow}`
      )
    }),

  // Get now playing movies
  nowPlaying: publicProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).default(1),
        })
        .optional()
    )
    .handler(async ({ input }) => {
      const page = input?.page ?? 1
      return await tmdbFetch<TMDBMovieListResponse>(
        `/movie/now_playing?page=${page}`
      )
    }),

  // Search movies
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        page: z.number().int().min(1).default(1),
      })
    )
    .handler(async ({ input }) => {
      const query = encodeURIComponent(input.query)
      return await tmdbFetch<TMDBMovieListResponse>(
        `/search/movie?query=${query}&page=${input.page}`
      )
    }),

  // Get movie details
  getMovie: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .handler(async ({ input }) => {
      return await tmdbFetch<TMDBMovieDetails>(
        `/movie/${input.id}?append_to_response=credits`
      )
    }),
}
