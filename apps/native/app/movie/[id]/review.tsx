import { Ionicons } from "@expo/vector-icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native"

import { client, orpc } from "@/utils/orpc"

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

// Skeleton component
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <View className={`bg-[#1c2a30] animate-pulse rounded-lg ${className}`} />
  )
}

export default function WriteReviewModal() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const movieId = Number(id)
  const queryClient = useQueryClient()

  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [containsSpoilers, setContainsSpoilers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null)

  // Fetch movie details - Validation
  const isValidMovieId = !Number.isNaN(movieId) && movieId > 0

  const movieQuery = useQuery({
    ...orpc.tmdb.getMovie.queryOptions({ input: { id: movieId } }),
    enabled: isValidMovieId,
  })

  // Fetch current user and reviews to check for existing review
  const meQuery = useQuery(orpc.user.getMe.queryOptions())
  const reviewsQuery = useQuery({
    ...orpc.review.getByMovie.queryOptions({ input: { tmdbMovieId: movieId } }),
    enabled: isValidMovieId,
  })

  // Check for existing review
  useEffect(() => {
    if (meQuery.data && reviewsQuery.data) {
      const myReview = reviewsQuery.data.find(
        (r) => r.user.id === meQuery.data?.id
      )
      if (myReview) {
        setIsEditing(true)
        setExistingReviewId(myReview.id)
        setRating(myReview.rating)
        setContent(myReview.content || "")
        setContainsSpoilers(myReview.containsSpoilers)
      }
    }
  }, [meQuery.data, reviewsQuery.data])

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async () => {
      return await client.review.create({
        tmdbMovieId: movieId,
        rating,
        content: content.trim() || undefined,
        containsSpoilers,
      })
    },
    onSuccess: () => {
      invalidateAndClose()
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to submit review")
    },
  })

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: async () => {
      if (!existingReviewId) throw new Error("No review to update")
      return await client.review.update({
        id: existingReviewId,
        rating,
        content: content.trim() || undefined,
        containsSpoilers,
      })
    },
    onSuccess: () => {
      invalidateAndClose()
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to update review")
    },
  })

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      if (!existingReviewId) throw new Error("No review to delete")
      return await client.review.delete({
        id: existingReviewId,
      })
    },
    onSuccess: () => {
      invalidateAndClose()
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to delete review")
    },
  })

  function invalidateAndClose() {
    queryClient.invalidateQueries({
      queryKey: orpc.review.getByMovie.queryOptions({
        input: { tmdbMovieId: movieId },
      }).queryKey,
    })
    queryClient.invalidateQueries({
      queryKey: orpc.review.getMyReviews.queryOptions().queryKey,
    })
    router.back()
  }

  function handleSubmit() {
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setError(null)
    if (isEditing) {
      updateReviewMutation.mutate()
    } else {
      createReviewMutation.mutate()
    }
  }

  function handleDelete() {
    setError(null)
    deleteReviewMutation.mutate()
  }

  const isLoading =
    createReviewMutation.isPending ||
    updateReviewMutation.isPending ||
    deleteReviewMutation.isPending
  const movie = movieQuery.data

  return (
    <View className='flex-1 bg-[#050B0D] pt-16'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps='handled'
      >
        {/* Header */}
        <View className='flex-row items-center justify-between mb-8'>
          <View className='flex-row items-center gap-4 flex-1'>
            {/* Mini Poster */}
            <View className='w-12 h-16 rounded-md overflow-hidden bg-[#1c2a30]'>
              {movie?.poster_path && (
                <Image
                  source={{
                    uri: `${TMDB_IMAGE_BASE}/w92${movie.poster_path}`,
                  }}
                  className='w-full h-full'
                  resizeMode='cover'
                />
              )}
            </View>
            <View className='flex-1'>
              <Text className='text-[#0db9f2] text-xs font-bold uppercase tracking-wider mb-0.5'>
                {isEditing ? "Edit Review" : "Write a Review"}
              </Text>
              <Text
                className='text-white text-xl font-bold leading-tight'
                numberOfLines={2}
              >
                {movie?.title || "Loading..."}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.back()}
            className='p-2 -mr-2 opacity-70 hover:opacity-100'
          >
            <Ionicons name='close' size={24} color='white' />
          </Pressable>
        </View>

        {/* Error message */}
        {error && (
          <View className='bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6'>
            <Text className='text-red-400 text-sm text-center'>{error}</Text>
          </View>
        )}

        {/* Rating Section */}
        <View className='items-center mb-8'>
          <View className='flex-row gap-4 mb-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                disabled={isLoading}
                className='active:scale-95 transition-transform'
              >
                <Ionicons
                  name='star'
                  size={36}
                  color={star <= rating ? "#0db9f2" : "#374151"}
                  style={{
                    textShadowColor:
                      star <= rating
                        ? "rgba(13, 185, 242, 0.5)"
                        : "transparent",
                    textShadowRadius: 10,
                  }}
                />
              </Pressable>
            ))}
          </View>
          <Text className='text-[#0db9f2] font-medium text-base h-6'>
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Great!"}
            {rating === 5 && "Masterpiece!"}
          </Text>
        </View>

        {/* Review Input */}
        <View className='bg-[#16262c] rounded-2xl p-4 mb-4 border border-white/5'>
          <TextInput
            className='min-h-40 text-white text-base leading-relaxed'
            placeholder='What did you think? Share your thoughts on the plot, acting, and cinematography...'
            placeholderTextColor='#64748b'
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical='top'
            maxLength={2000}
            editable={!isLoading}
            style={{ padding: 0 }}
          />
        </View>

        {/* Spoilers Toggle */}
        <View className='bg-[#16262c] rounded-2xl p-4 flex-row items-center gap-3 border border-white/5 mb-8'>
          <View className='w-10 h-10 rounded-full bg-white/5 items-center justify-center'>
            <Ionicons
              name={containsSpoilers ? "eye-off" : "eye"}
              size={20}
              color={containsSpoilers ? "#0db9f2" : "#9ca3af"}
            />
          </View>
          <View className='flex-1'>
            <Text className='text-white font-bold text-base'>
              Contains Spoilers
            </Text>
            <Text className='text-[#64748b] text-xs'>
              Mark review as hiding plot details
            </Text>
          </View>
          <Switch
            value={containsSpoilers}
            onValueChange={setContainsSpoilers}
            trackColor={{ false: "#374151", true: "#0db9f2" }}
            thumbColor='white'
          />
        </View>

        {/* Submit Button */}
        <Pressable
          className={`w-full h-14 rounded-xl items-center justify-center shadow-lg shadow-[#0db9f2]/20 ${
            isLoading || rating === 0 ? "bg-[#0db9f2]/50" : "bg-[#0db9f2]"
          }`}
          onPress={handleSubmit}
          disabled={isLoading || rating === 0}
          style={({ pressed }) => [
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          {isLoading ? (
            <View className='flex-row items-center gap-2'>
              <Skeleton className='w-5 h-5 rounded-full' />
              <Text className='text-[#101e22] font-bold text-lg'>
                {isEditing ? "Updating..." : "Submitting..."}
              </Text>
            </View>
          ) : (
            <Text className='text-[#101e22] font-bold text-lg'>
              {isEditing ? "Update Review" : "Submit Review"}
            </Text>
          )}
        </Pressable>

        {/* Delete Button (Only in Edit mode) */}
        {isEditing && (
          <Pressable
            className='w-full h-14 mt-4 rounded-xl items-center justify-center border border-red-500/20'
            onPress={handleDelete}
            disabled={isLoading}
          >
            <Text className='text-red-500 font-bold text-lg'>
              Delete Review
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  )
}
