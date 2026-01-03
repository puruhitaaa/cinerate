import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { FlatList, Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// --- Components ---

function TopHeader() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "900",
          color: "white",
          letterSpacing: 0.5,
        }}
      >
        Cine<Text style={{ color: "#0db9f2" }}>Rate</Text>
      </Text>
      <Pressable>
        <Ionicons name='notifications' size={24} color='white' />
      </Pressable>
    </View>
  )
}

function TrendingCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] || ""
  const genre = getGenreName(movie.genre_ids[0])
  const rating = movie.vote_average.toFixed(1)

  return (
    <Pressable
      className='w-40 mr-4'
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <View className='w-full aspect-2/3 rounded-2xl overflow-hidden bg-[#1c2a30] relative'>
        {movie.poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` }}
            className='w-full h-full'
            resizeMode='cover'
          />
        ) : (
          <View className='w-full h-full items-center justify-center'>
            <Ionicons name='film-outline' size={48} color='#4b5563' />
          </View>
        )}

        {/* Gradient Overlay - Using Uniwind's native gradient support */}
        <View className='absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent' />

        {/* Rating Badge */}
        <View className='absolute top-2.5 right-2.5 bg-black/70 rounded-md px-1.5 py-0.5 flex-row items-center border border-white/10'>
          <Ionicons
            name='star'
            size={10}
            color='#0db9f2'
            style={{ marginRight: 4 }}
          />
          <Text className='text-white text-[10px] font-bold'>{rating}</Text>
        </View>

        {/* Text Overlay */}
        <View className='absolute bottom-3 left-3 right-3'>
          <Text
            className='text-white text-base font-bold leading-5'
            numberOfLines={2}
          >
            {movie.title}
          </Text>
          <Text className='text-[#9ca3af] text-[11px] mt-1'>
            {genre} • {year}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

function GridCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.split("-")[0] || ""
  const genre = getGenreName(movie.genre_ids[0])

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

        {/* Add Button */}
        {/* TODO: Add to watchlist */}
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

// --- Main Screen ---

export default function HomeScreen() {
  const trendingQuery = useQuery(orpc.tmdb.trending.queryOptions())
  const nowPlayingQuery = useQuery(orpc.tmdb.nowPlaying.queryOptions())

  const trendingData = trendingQuery.data?.results || []
  const gridData = nowPlayingQuery.data?.results || []

  return (
    <View style={{ flex: 1, backgroundColor: "#050B0D" }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <FlashList
          data={gridData}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GridCard movie={item} />}
          // estimatedItemSize={280}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={
            <>
              <TopHeader />

              {/* Trending Section */}
              <View style={{ marginTop: 20, marginBottom: 30 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "800", color: "white" }}
                  >
                    Trending Now
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#0db9f2",
                      fontWeight: "600",
                    }}
                  >
                    See All
                  </Text>
                </View>

                <FlatList
                  data={trendingData.slice(0, 5)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => <TrendingCard movie={item} />}
                />
              </View>

              {/* In Theaters Header */}
              <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "800", color: "white" }}
                >
                  In Theaters
                </Text>
              </View>
            </>
          }
        />
      </SafeAreaView>
    </View>
  )
}

// --- Helpers ---

interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date: string
  genre_ids: number[]
}

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
