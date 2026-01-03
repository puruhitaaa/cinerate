import z from "zod"

/**
 * Standard cursor-based pagination input schema.
 * Uses `cursor` (string ID) and `limit` for efficient infinite scrolling.
 */
export const cursorPaginationSchema = z
  .object({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional().default(10),
  })
  .optional()
  .default(() => ({ limit: 10 }))

export type CursorPaginationInput = z.infer<typeof cursorPaginationSchema>

/**
 * Generic cursor-based pagination response structure.
 * @template T - The type of items in the response
 */
export interface CursorPaginationResponse<T> {
  items: T[]
  nextCursor: string | null
}

/**
 * Creates a cursor-based pagination response from a list of items.
 * Assumes `items` were fetched with `take: limit + 1` to detect if there's a next page.
 *
 * @param items - Array of items fetched from DB (should be limit + 1 if more exist)
 * @param limit - The requested page size
 * @param getId - Function to extract the cursor ID from an item
 * @returns Formatted pagination response with items and nextCursor
 */
export function createCursorResponse<T>(
  items: T[],
  limit: number,
  getId: (item: T) => string
): CursorPaginationResponse<T> {
  const hasMore = items.length > limit
  const resultItems = hasMore ? items.slice(0, limit) : items

  // Get the last item of the result set for the cursor
  const lastItem = resultItems[resultItems.length - 1]
  const nextCursor = hasMore && lastItem ? getId(lastItem) : null

  return {
    items: resultItems,
    nextCursor,
  }
}
