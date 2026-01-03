import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { Image, Pressable, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// Proper debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// --- Types ---

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

// --- Components ---

function SearchResultSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        backgroundColor: "#1A2C32",
      }}
    >
      <View
        style={{
          width: 70,
          height: 100,
          borderRadius: 12,
          backgroundColor: "#25363d",
        }}
      />
      <View style={{ flex: 1, marginLeft: 14, gap: 8 }}>
        <View
          style={{
            height: 18,
            width: "70%",
            borderRadius: 4,
            backgroundColor: "#25363d",
          }}
        />
        <View
          style={{
            height: 14,
            width: "50%",
            borderRadius: 4,
            backgroundColor: "#25363d",
          }}
        />
        <View
          style={{
            height: 20,
            width: 60,
            borderRadius: 6,
            backgroundColor: "#25363d",
            marginTop: 4,
          }}
        />
      </View>
    </View>
  )
}

function SearchSkeletonList() {
  return (
    <View>
      {[1, 2, 3, 4, 5].map((i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </View>
  )
}

function SearchResultCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] || ""
  const genres = getGenreNames(movie.genre_ids)
  const rating = (movie.vote_average / 2).toFixed(1)

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
        backgroundColor: "#1A2C32",
      }}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      {/* Poster */}
      <View
        style={{
          width: 70,
          height: 100,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#25363d",
        }}
      >
        {movie.poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}/w185${movie.poster_path}` }}
            style={{ width: "100%", height: "100%" }}
            resizeMode='cover'
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name='film-outline' size={24} color='#4b5563' />
          </View>
        )}
      </View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          marginLeft: 14,
          height: 100,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "white",
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {movie.title}
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: "#9cb2ba",
            fontWeight: "500",
            marginBottom: 10,
          }}
        >
          {year} • {genres}
        </Text>

        {/* Rating */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name='star' size={14} color='#0db9f2' />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#0db9f2",
            }}
          >
            {rating}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#64748b",
              marginLeft: 2,
            }}
          >
            / 5
          </Text>
        </View>
      </View>

      {/* Bookmark Icon */}
      {/* <Pressable
        style={{
          padding: 8,
          marginLeft: 8,
        }}
        onPress={(e) => {
          e.stopPropagation()
          // TODO: Add to watchlist
        }}
      >
        <Ionicons name='bookmark-outline' size={22} color='#64748b' />
      </Pressable> */}
    </Pressable>
  )
}

// --- Main Screen ---

export default function SearchScreen() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 400)

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#101e22" }}>
      {/* Search Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1A2C32",
            borderRadius: 12,
            paddingHorizontal: 14,
          }}
        >
          <Ionicons name='search' size={20} color='#64748b' />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: "white",
              paddingHorizontal: 12,
              paddingVertical: 14,
              height: 50,
            }}
            placeholder='Sci-Fi'
            placeholderTextColor='#64748b'
            value={query}
            onChangeText={setQuery}
            autoCapitalize='none'
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear} style={{ padding: 4 }}>
              <Ionicons name='close' size={20} color='#64748b' />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {!query ? (
        // Empty state - minimal design
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <Ionicons name='search' size={64} color='#1A2C32' />
          <Text
            style={{
              color: "#9cb2ba",
              fontSize: 18,
              fontWeight: "600",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Search for movies
          </Text>
          <Text
            style={{
              color: "#64748b",
              fontSize: 14,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Find your next favorite film to rate and review
          </Text>
        </View>
      ) : searchQuery.isPending ? (
        // Loading state
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
              Top Results
            </Text>
          </View>
          <SearchSkeletonList />
        </View>
      ) : hasResults ? (
        // Results
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
              Top Results
            </Text>
            {/* <Pressable
              onPress={() =>
                router.push({
                  pathname: "/movies",
                  params: { title: `"${query}" Results` },
                })
              }
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#0db9f2" }}
              >
                See all
              </Text>
            </Pressable> */}
          </View>

          {/* Results List */}
          <FlashList
            data={searchQuery.data?.results}
            renderItem={({ item }) => <SearchResultCard movie={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      ) : (
        // No results
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          <Ionicons name='film-outline' size={64} color='#1A2C32' />
          <Text
            style={{
              color: "#9cb2ba",
              fontSize: 18,
              fontWeight: "600",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            No movies found
          </Text>
          <Text
            style={{
              color: "#64748b",
              fontSize: 14,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Try a different search term
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}
