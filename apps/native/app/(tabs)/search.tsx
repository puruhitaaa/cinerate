import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import { Image, Pressable, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  })

  // Update immediately for now, we'll implement proper debounce
  if (debouncedValue !== value) {
    setDebouncedValue(value)
  }

  return debouncedValue
}

// Skeleton components
function SearchResultSkeleton() {
  return (
    <View className='flex-row items-start gap-4 p-3 mx-4 my-2 rounded-xl bg-[#1A2C32]'>
      <View className='w-[72px] h-[108px] rounded-lg bg-[#25363d] animate-pulse' />
      <View className='flex-1 py-1 gap-2'>
        <View className='h-5 w-3/4 rounded bg-[#25363d] animate-pulse' />
        <View className='h-3 w-1/2 rounded bg-[#25363d] animate-pulse' />
        <View className='h-6 w-16 rounded-md bg-[#25363d] animate-pulse mt-auto' />
      </View>
    </View>
  )
}

function SearchSkeletonList() {
  return (
    <View>
      {[1, 2, 3, 4].map((i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </View>
  )
}

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
}

// Genre mapping
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}

function getGenreNames(genreIds: number[]): string {
  return genreIds
    .slice(0, 2)
    .map((id) => GENRE_MAP[id] || "Movie")
    .join(", ")
}

function SearchResultCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] || ""
  const genres = getGenreNames(movie.genre_ids)
  const rating = (movie.vote_average / 2).toFixed(1)

  return (
    <Pressable
      className='flex-row items-start gap-4 p-3 mx-4 my-2 rounded-xl bg-[#1A2C32] border border-white/5'
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      {/* Poster */}
      <View className='w-[72px] h-[108px] rounded-lg overflow-hidden bg-[#25363d]'>
        {movie.poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}/w185${movie.poster_path}` }}
            className='w-full h-full'
            resizeMode='cover'
          />
        ) : (
          <View className='w-full h-full items-center justify-center'>
            <Ionicons name='film-outline' size={24} color='#4b5563' />
          </View>
        )}
      </View>

      {/* Content */}
      <View className='flex-1 h-[108px] justify-between py-1'>
        <View>
          <View className='flex-row justify-between items-start'>
            <Text
              className='text-base font-bold text-white flex-1 pr-2'
              numberOfLines={2}
            >
              {movie.title}
            </Text>
            <Pressable className='p-1'>
              <Ionicons name='bookmark-outline' size={22} color='#9cb2ba' />
            </Pressable>
          </View>
          <Text className='text-sm text-[#9cb2ba] font-medium mt-1'>
            {year} • {genres}
          </Text>
        </View>

        {/* Rating */}
        <View className='flex-row items-center gap-1.5 bg-[#0db9f2]/10 px-2 py-1 rounded-md self-start'>
          <Ionicons name='star' size={14} color='#0db9f2' />
          <Text className='text-sm font-bold text-[#0db9f2]'>{rating}</Text>
          <Text className='text-xs text-[#9cb2ba] ml-1'>/ 5</Text>
        </View>
      </View>
    </Pressable>
  )
}

// Category chips
const CATEGORIES = [
  "Sci-Fi Thriller",
  "Space Opera",
  "Futuristic",
  "Action",
  "Drama",
]

export default function SearchScreen() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  const searchQuery = useQuery({
    ...orpc.tmdb.search.queryOptions({
      input: {
        query: debouncedQuery,
      },
    }),
    enabled: debouncedQuery.length > 0,
  })

  const handleClear = useCallback(() => {
    setQuery("")
  }, [])

  const hasResults =
    searchQuery.data?.results && searchQuery.data.results.length > 0

  return (
    <SafeAreaView className='flex-1 bg-[#101e22]'>
      {/* Search Header */}
      <View className='px-4 py-3 border-b border-white/5'>
        <View className='flex-row items-center bg-[#1A2C32] rounded-lg overflow-hidden'>
          <View className='pl-4'>
            <Ionicons name='search' size={22} color='#9cb2ba' />
          </View>
          <TextInput
            className='flex-1 bg-transparent text-base text-white px-3 py-3 h-12'
            placeholder='Search movies, actors...'
            placeholderTextColor='#9cb2ba'
            value={query}
            onChangeText={setQuery}
            autoCapitalize='none'
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable className='pr-4' onPress={handleClear}>
              <Ionicons name='close' size={20} color='#9cb2ba' />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {!query ? (
        // Empty state
        <View className='flex-1 items-center justify-center px-8'>
          <Ionicons name='search' size={64} color='#1A2C32' />
          <Text className='text-[#9cb2ba] text-lg font-medium mt-4 text-center'>
            Search for a movie...
          </Text>
          <Text className='text-[#64748b] text-sm mt-2 text-center'>
            Find your next favorite film to rate and review
          </Text>
        </View>
      ) : searchQuery.isPending ? (
        // Loading state
        <SearchSkeletonList />
      ) : hasResults ? (
        // Results
        <View className='flex-1'>
          <View className='flex-row items-center justify-between px-4 py-3'>
            <Text className='text-lg font-bold text-white'>Top Results</Text>
            <Text className='text-xs font-medium text-[#0db9f2]'>
              {searchQuery.data?.total_results} found
            </Text>
          </View>

          <FlashList
            data={searchQuery.data?.results}
            renderItem={({ item }) => <SearchResultCard movie={item} />}
            // estimatedItemSize={132}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListFooterComponent={
              <View className='pt-4 px-4 border-t border-white/5 mt-4'>
                <Text className='text-sm font-semibold text-[#9cb2ba] uppercase tracking-wider mb-4'>
                  Related Categories
                </Text>
                <View className='flex-row flex-wrap gap-2'>
                  {CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      className='px-4 py-2 rounded-full bg-[#1A2C32] border border-white/10'
                    >
                      <Text className='text-sm font-medium text-white'>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            }
          />
        </View>
      ) : (
        // No results
        <View className='flex-1 items-center justify-center px-8'>
          <Ionicons name='film-outline' size={64} color='#1A2C32' />
          <Text className='text-[#9cb2ba] text-lg font-medium mt-4 text-center'>
            No movies found
          </Text>
          <Text className='text-[#64748b] text-sm mt-2 text-center'>
            Try a different search term
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}
