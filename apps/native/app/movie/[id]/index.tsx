import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// Skeleton components
function HeroSkeleton() {
  return (
    <View className='h-87.5 bg-[#1c2a30] animate-pulse'>
      <View className='absolute bottom-4 left-4 right-4 flex-row gap-4'>
        <View className='w-28 h-40 rounded-lg bg-[#25363d] animate-pulse' />
        <View className='flex-1 justify-end gap-2'>
          <View className='h-6 w-3/4 rounded bg-[#25363d] animate-pulse' />
          <View className='h-4 w-1/2 rounded bg-[#25363d] animate-pulse' />
        </View>
      </View>
    </View>
  )
}

function InfoSkeleton() {
  return (
    <View className='px-4 py-4 gap-4'>
      <View className='h-5 w-full rounded bg-[#1c2a30] animate-pulse' />
      <View className='h-5 w-3/4 rounded bg-[#1c2a30] animate-pulse' />
      <View className='h-5 w-1/2 rounded bg-[#1c2a30] animate-pulse' />
    </View>
  )
}

function ReviewSkeleton() {
  return (
    <View className='p-4 rounded-xl bg-[#18282d] border border-gray-800'>
      <View className='flex-row items-center gap-3 mb-3'>
        <View className='w-10 h-10 rounded-full bg-[#25363d] animate-pulse' />
        <View className='flex-1 gap-1'>
          <View className='h-4 w-24 rounded bg-[#25363d] animate-pulse' />
          <View className='h-3 w-16 rounded bg-[#25363d] animate-pulse' />
        </View>
      </View>
      <View className='h-12 w-full rounded bg-[#25363d] animate-pulse' />
    </View>
  )
}

// Review card
interface Review {
  id: string
  rating: number
  content: string | null
  containsSpoilers: boolean
  createdAt: Date
  user: {
    id: string
    name: string
    username: string | null
    image: string | null
  }
}

function ReviewCard({
  review,
  isMine,
  onEdit,
}: {
  review: Review
  isMine: boolean
  onEdit: () => void
}) {
  const [showSpoiler, setShowSpoiler] = useState(false)
  const date = new Date(review.createdAt)
  const timeAgo = getTimeAgo(date)

  const hasSpoilers = review.containsSpoilers
  const isContentVisible = !hasSpoilers || showSpoiler || isMine

  return (
    <View
      className={`p-4 rounded-xl bg-[#18282d] border ${
        isMine ? "border-[#0db9f2]/50" : "border-gray-800"
      } mb-3`}
    >
      <View className='flex-row items-center gap-3 mb-3'>
        {/* Avatar */}
        <View className='w-10 h-10 rounded-full bg-[#25363d] overflow-hidden items-center justify-center'>
          {review.user.image ? (
            <Image
              source={{ uri: review.user.image }}
              className='w-full h-full'
            />
          ) : (
            <Ionicons name='person' size={20} color='#9cb2ba' />
          )}
        </View>
        <View className='flex-1'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-white font-semibold'>
              {isMine
                ? "You"
                : review.user.name || review.user.username || "Anonymous"}
            </Text>
            {isMine && (
              <Pressable onPress={onEdit} className='p-1'>
                <Ionicons name='pencil-sharp' size={16} color='#0db9f2' />
              </Pressable>
            )}
          </View>

          <View className='flex-row items-center gap-2'>
            <View className='flex-row'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name='star'
                  size={12}
                  color={star <= review.rating ? "#0db9f2" : "#374151"}
                />
              ))}
            </View>
            <Text className='text-gray-500 text-xs'>{timeAgo}</Text>
          </View>
        </View>
      </View>

      {review.content && (
        <View>
          {!isContentVisible ? (
            <Pressable
              onPress={() => setShowSpoiler(true)}
              className='bg-[#25363d] rounded-lg p-3 flex-row items-center justify-center gap-2 active:opacity-80'
            >
              <Ionicons name='eye-off' size={16} color='#9cb2ba' />
              <Text className='text-[#9cb2ba] font-medium text-sm'>
                Contains Spoilers • Tap to View
              </Text>
            </Pressable>
          ) : (
            <View>
              {hasSpoilers && !isMine && (
                <Text className='text-[#0db9f2] text-xs font-bold mb-1 uppercase tracking-wider'>
                  Spoiler
                </Text>
              )}
              <Text className='text-[#9cb2ba] text-sm leading-relaxed'>
                {review.content}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1d ago"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const movieId = Number(id)

  const isValidMovieId = !Number.isNaN(movieId) && movieId > 0

  const movieQuery = useQuery({
    ...orpc.tmdb.getMovie.queryOptions({ input: { id: movieId } }),
    enabled: isValidMovieId,
  })

  const reviewsQuery = useQuery({
    ...orpc.review.getByMovie.queryOptions({ input: { tmdbMovieId: movieId } }),
    enabled: isValidMovieId,
  })

  const meQuery = useQuery(orpc.user.getMe.queryOptions())

  const movie = movieQuery.data
  const reviews = reviewsQuery.data
  const me = meQuery.data

  // Check if I reviewed
  const myReview =
    me && reviews ? reviews.find((r) => r.user.id === me.id) : null
  const hasReviewed = !!myReview

  const year = movie?.release_date?.split("-")[0] || ""
  const rating = movie?.vote_average ? (movie.vote_average / 2).toFixed(1) : "0"
  const runtime = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : ""

  const handleEditReview = () => {
    router.push(`/movie/${movieId}/review`)
  }

  return (
    <View className='flex-1 bg-[#101e22]'>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        {movieQuery.isPending ? (
          <HeroSkeleton />
        ) : movie ? (
          <ImageBackground
            source={{
              uri: movie.backdrop_path
                ? `${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}`
                : undefined,
            }}
            className='h-87.5'
            resizeMode='cover'
          >
            {/* Gradient overlay */}
            <View className='absolute inset-0 bg-linear-to-t from-[#101e22] via-[#101e22]/60 to-transparent' />

            {/* Back button */}
            <SafeAreaView className='flex-1'>
              <Pressable
                className='absolute top-16 left-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center'
                onPress={() => router.back()}
              >
                <Ionicons name='arrow-back' size={22} color='white' />
              </Pressable>
            </SafeAreaView>

            {/* Poster & Info overlay */}
            <View className='absolute bottom-4 left-4 right-4 flex-row gap-4'>
              {/* Poster */}
              <View className='w-28 h-40 rounded-lg overflow-hidden shadow-xl'>
                {movie.poster_path ? (
                  <Image
                    source={{
                      uri: `${TMDB_IMAGE_BASE}/w342${movie.poster_path}`,
                    }}
                    className='w-full h-full'
                    resizeMode='cover'
                  />
                ) : (
                  <View className='w-full h-full bg-[#1c2a30] items-center justify-center'>
                    <Ionicons name='film-outline' size={32} color='#4b5563' />
                  </View>
                )}
              </View>

              {/* Title & Meta */}
              <View className='flex-1 justify-end'>
                <Text
                  className='text-white text-xl font-bold leading-tight'
                  numberOfLines={2}
                >
                  {movie.title}
                </Text>
                <Text className='text-[#9cb2ba] text-sm mt-1'>
                  {year} • {runtime}
                </Text>
                <View className='flex-row items-center gap-2 mt-2'>
                  <View className='flex-row items-center gap-1 bg-[#0db9f2]/20 px-2 py-1 rounded-md'>
                    <Ionicons name='star' size={14} color='#0db9f2' />
                    <Text className='text-[#0db9f2] font-bold'>{rating}</Text>
                    <Text className='text-[#9cb2ba] text-xs'>/ 5</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        ) : null}

        {/* Genres */}
        {movie && (
          <View className='px-4 pt-4'>
            <View className='flex-row flex-wrap gap-2'>
              {movie.genres?.map((genre) => (
                <View
                  key={genre.id}
                  className='px-3 py-1.5 rounded-full bg-[#1c2a30] border border-white/10'
                >
                  <Text className='text-white text-xs font-medium'>
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Overview */}
        {movieQuery.isPending ? (
          <InfoSkeleton />
        ) : movie?.overview ? (
          <View className='px-4 pt-6'>
            <Text className='text-white text-lg font-bold mb-2'>Overview</Text>
            <Text className='text-[#9cb2ba] text-sm leading-relaxed'>
              {movie.overview}
            </Text>
          </View>
        ) : null}

        {/* Community Reviews */}
        <View className='px-4 pt-8'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-white text-lg font-bold'>
              Community Reviews
            </Text>
            {reviews && reviews.length > 0 && (
              <Text className='text-[#9cb2ba] text-sm'>
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Text>
            )}
          </View>

          {reviewsQuery.isPending ? (
            <>
              <ReviewSkeleton />
              <ReviewSkeleton />
            </>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isMine={me ? review.user.id === me.id : false}
                onEdit={handleEditReview}
              />
            ))
          ) : (
            <View className='items-center py-8 bg-[#18282d] rounded-xl border border-gray-800'>
              <Ionicons name='chatbubble-outline' size={32} color='#374151' />
              <Text className='text-[#9cb2ba] font-medium mt-3'>
                No reviews yet
              </Text>
              <Text className='text-[#64748b] text-sm mt-1'>
                Be the first to share your thoughts!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {!hasReviewed && (
        <View className='absolute bottom-6 right-6'>
          <Pressable
            className='flex-row items-center gap-2 bg-[#0db9f2] px-5 py-3 rounded-full shadow-lg'
            onPress={() => router.push(`/movie/${movieId}/review`)}
          >
            <Ionicons name='star' size={20} color='#101e22' />
            <Text className='text-[#101e22] font-bold'>Rate Movie</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
