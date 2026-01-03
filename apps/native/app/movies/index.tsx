import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { router, useLocalSearchParams } from "expo-router"
import { useCallback, useState } from "react"
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { client, orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// --- Types ---

interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
}

type SortOption =
  | "popularity.desc"
  | "popularity.asc"
  | "vote_average.desc"
  | "vote_average.asc"
  | "primary_release_date.desc"
  | "primary_release_date.asc"
  | "revenue.desc"
  | "title.asc"
  | "title.desc"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Revenue" },
  { value: "title.asc", label: "Title (A-Z)" },
  { value: "title.desc", label: "Title (Z-A)" },
]

const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Doc",
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

function getGenreName(genreId: number): string {
  return GENRE_MAP[genreId] || "Movie"
}

// --- Components ---

function GridCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] || ""
  const genre = getGenreName(movie.genre_ids[0])
  const rating = movie.vote_average.toFixed(1)

  return (
    <Pressable
      style={{ flex: 1, margin: 8 }}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <View
        style={{
          width: "100%",
          aspectRatio: 2 / 3,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#1c2a30",
          position: "relative",
        }}
      >
        {movie.poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}/w342${movie.poster_path}` }}
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
            <Ionicons name='film-outline' size={32} color='#4b5563' />
          </View>
        )}

        {/* Rating Badge */}
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Ionicons
            name='star'
            size={10}
            color='#0db9f2'
            style={{ marginRight: 4 }}
          />
          <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
            {rating}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 8, paddingHorizontal: 4 }}>
        <Text
          style={{ color: "white", fontSize: 14, fontWeight: "700" }}
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <Text style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
          {genre} • {year}
        </Text>
      </View>
    </Pressable>
  )
}

function ListFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  return (
    <View style={{ paddingVertical: 24, alignItems: "center" }}>
      <ActivityIndicator size='small' color='#0db9f2' />
      <Text style={{ marginTop: 8, fontSize: 12, color: "#566874" }}>
        Loading more...
      </Text>
    </View>
  )
}

function EmptyState() {
  return (
    <View
      style={{
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.5,
      }}
    >
      <Ionicons name='film-outline' size={48} color='#2d3b42' />
      <Text style={{ marginTop: 16, color: "#566874" }}>No movies found</Text>
    </View>
  )
}

// --- Filter Modal ---

function FilterModal({
  visible,
  onClose,
  sortBy,
  setSortBy,
  selectedGenres,
  setSelectedGenres,
  onApply,
  onReset,
}: {
  visible: boolean
  onClose: () => void
  sortBy: SortOption
  setSortBy: (value: SortOption) => void
  selectedGenres: number[]
  setSelectedGenres: (genres: number[]) => void
  onApply: () => void
  onReset: () => void
}) {
  const genresQuery = useQuery(orpc.tmdb.getGenres.queryOptions())
  const genres = genresQuery.data?.genres || []

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId))
    } else {
      setSelectedGenres([...selectedGenres, genreId])
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            backgroundColor: "#101e22",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 16,
            paddingBottom: 40,
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: "white" }}>
              Filters
            </Text>
            <Pressable onPress={onReset}>
              <Text
                style={{ fontSize: 14, color: "#0db9f2", fontWeight: "600" }}
              >
                Reset
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Sort By */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#9cb2ba",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Sort By
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setSortBy(option.value)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor:
                      sortBy === option.value ? "#0db9f2" : "#1c2a30",
                    borderWidth: 1,
                    borderColor:
                      sortBy === option.value ? "#0db9f2" : "#25363d",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: sortBy === option.value ? "#101e22" : "#9cb2ba",
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Genres */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#9cb2ba",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Genres
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.id)
                return (
                  <Pressable
                    key={genre.id}
                    onPress={() => toggleGenre(genre.id)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: isSelected ? "#0db9f2" : "#1c2a30",
                      borderWidth: 1,
                      borderColor: isSelected ? "#0db9f2" : "#25363d",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: isSelected ? "#101e22" : "#9cb2ba",
                      }}
                    >
                      {genre.name}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Pressable
              onPress={onApply}
              style={{
                backgroundColor: "#0db9f2",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#101e22", fontSize: 16, fontWeight: "700" }}
              >
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// --- Main Screen ---

export default function MoviesScreen() {
  const params = useLocalSearchParams<{ title?: string }>()
  const screenTitle = params.title || "Discover Movies"

  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc")
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  // Temporary state for filter modal (so we can cancel without applying)
  const [tempSortBy, setTempSortBy] = useState<SortOption>(sortBy)
  const [tempSelectedGenres, setTempSelectedGenres] =
    useState<number[]>(selectedGenres)

  const moviesInfiniteQuery = useInfiniteQuery({
    queryKey: ["discoverMovies", sortBy, selectedGenres],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await client.tmdb.discoverMovies({
        page: pageParam,
        sortBy,
        withGenres: selectedGenres.length > 0 ? selectedGenres : undefined,
        voteCountGte: 100, // Filter out obscure movies
      })
      return result
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
      return undefined
    },
  })

  const handleEndReached = useCallback(() => {
    if (
      moviesInfiniteQuery.hasNextPage &&
      !moviesInfiniteQuery.isFetchingNextPage
    ) {
      moviesInfiniteQuery.fetchNextPage()
    }
  }, [moviesInfiniteQuery])

  const handleOpenFilter = () => {
    setTempSortBy(sortBy)
    setTempSelectedGenres(selectedGenres)
    setFilterModalVisible(true)
  }

  const handleApplyFilter = () => {
    setSortBy(tempSortBy)
    setSelectedGenres(tempSelectedGenres)
    setFilterModalVisible(false)
  }

  const handleResetFilter = () => {
    setTempSortBy("popularity.desc")
    setTempSelectedGenres([])
  }

  // Flatten all pages into a single array of movies
  const allMovies =
    moviesInfiniteQuery.data?.pages.flatMap((page) => page.results) ?? []

  // Check if any filter is active
  const hasActiveFilters =
    sortBy !== "popularity.desc" || selectedGenres.length > 0

  return (
    <View style={{ flex: 1, backgroundColor: "#050B0D" }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {/* Back Button */}
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={22} color='white' />
          </Pressable>

          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "white",
              flex: 1,
              textAlign: "center",
            }}
          >
            {screenTitle}
          </Text>

          {/* Filter Button */}
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: hasActiveFilters ? "#0db9f2" : "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleOpenFilter}
          >
            <Ionicons
              name='options'
              size={20}
              color={hasActiveFilters ? "#050B0D" : "white"}
            />
          </Pressable>
        </View>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              paddingBottom: 8,
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {sortBy !== "popularity.desc" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#1c2a30",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ fontSize: 11, color: "#0db9f2", fontWeight: "600" }}
                >
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                </Text>
              </View>
            )}
            {selectedGenres.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#1c2a30",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ fontSize: 11, color: "#0db9f2", fontWeight: "600" }}
                >
                  {selectedGenres.length} genre
                  {selectedGenres.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Movies Grid */}
        <FlashList
          data={allMovies}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GridCard movie={item} />}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <ListFooter isLoading={moviesInfiniteQuery.isFetchingNextPage} />
          }
          ListEmptyComponent={
            moviesInfiniteQuery.isPending ? (
              <View style={{ paddingVertical: 32, alignItems: "center" }}>
                <ActivityIndicator size='large' color='#0db9f2' />
              </View>
            ) : (
              <EmptyState />
            )
          }
        />
      </SafeAreaView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        sortBy={tempSortBy}
        setSortBy={setTempSortBy}
        selectedGenres={tempSelectedGenres}
        setSelectedGenres={setTempSelectedGenres}
        onApply={handleApplyFilter}
        onReset={handleResetFilter}
      />
    </View>
  )
}
