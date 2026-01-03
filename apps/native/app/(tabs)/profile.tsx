import { Ionicons } from "@expo/vector-icons"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { Image, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { authClient } from "@/lib/auth-client"
import { orpc, queryClient } from "@/utils/orpc"

// Skeleton components
function ProfileHeaderSkeleton() {
  return (
    <View className='items-center pt-6 pb-2 px-4'>
      <View className='w-32 h-32 rounded-full bg-[#1c2a30] animate-pulse' />
      <View className='mt-4 w-40 h-6 rounded bg-[#1c2a30] animate-pulse' />
      <View className='mt-2 w-32 h-4 rounded bg-[#1c2a30] animate-pulse' />
    </View>
  )
}

function StatsRowSkeleton() {
  return (
    <View className='flex-row justify-center gap-3 px-4 py-4'>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className='flex-1 h-20 rounded-xl bg-[#1c2a30] animate-pulse'
        />
      ))}
    </View>
  )
}

function ReviewCardSkeleton() {
  return (
    <View className='flex-row gap-4 p-3 rounded-xl bg-[#18282d] border border-gray-800'>
      <View className='w-20 aspect-[2/3] rounded-lg bg-[#25363d] animate-pulse' />
      <View className='flex-1 py-1 gap-2'>
        <View className='h-5 w-3/4 rounded bg-[#25363d] animate-pulse' />
        <View className='h-3 w-1/2 rounded bg-[#25363d] animate-pulse' />
        <View className='h-4 w-20 rounded bg-[#25363d] animate-pulse' />
        <View className='h-10 w-full rounded bg-[#25363d] animate-pulse' />
      </View>
    </View>
  )
}

// Stats card
function StatCard({
  value,
  label,
  isPrimary = false,
}: {
  value: number | string
  label: string
  isPrimary?: boolean
}) {
  return (
    <View className='flex-1 gap-1 rounded-xl bg-[#18282d] border border-gray-800 p-3 items-center'>
      <Text
        className={`text-2xl font-extrabold tracking-tight ${
          isPrimary ? "text-[#0db9f2]" : "text-white"
        }`}
      >
        {value}
      </Text>
      <Text className='text-[#9cb2ba] text-xs font-semibold uppercase tracking-wide'>
        {label}
      </Text>
    </View>
  )
}

// Review card placeholder (we don't have movie data in reviews yet)
interface Review {
  id: string
  rating: number
  content: string | null
  tmdbMovieId: number
  createdAt: Date
}

function ReviewCard({ review }: { review: Review }) {
  // Format the date
  const date = new Date(review.createdAt)
  const timeAgo = getTimeAgo(date)

  return (
    <Pressable
      className='flex-row gap-4 p-3 rounded-xl bg-[#18282d] border border-gray-800'
      onPress={() => router.push(`/movie/${review.tmdbMovieId}`)}
    >
      {/* Movie Poster placeholder */}
      <View className='w-20 aspect-[2/3] rounded-lg bg-[#25363d] items-center justify-center'>
        <Ionicons name='film-outline' size={24} color='#4b5563' />
      </View>

      <View className='flex-1 py-1 gap-1'>
        <View className='flex-row justify-between items-start'>
          <View className='flex-1'>
            <Text className='text-white text-base font-bold'>
              Movie #{review.tmdbMovieId}
            </Text>
            <Text className='text-gray-500 text-xs font-medium mt-0.5'>
              {timeAgo}
            </Text>
          </View>
        </View>

        {/* Stars */}
        <View className='flex-row items-center gap-0.5 my-1'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name='star'
              size={16}
              color={star <= review.rating ? "#0db9f2" : "#374151"}
            />
          ))}
        </View>

        {review.content && (
          <Text
            className='text-[#9cb2ba] text-sm leading-snug'
            numberOfLines={2}
          >
            {review.content}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  }
  if (diffDays === 1) {
    return "1d ago"
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`
  }
  if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)}w ago`
  }
  return `${Math.floor(diffDays / 30)}mo ago`
}

export default function ProfileScreen() {
  // const { data: session } = authClient.useSession()
  const userQuery = useQuery(orpc.user.getMe.queryOptions())
  const reviewsQuery = useQuery(orpc.review.getMyReviews.queryOptions())

  async function handleLogout() {
    await authClient.signOut()
    queryClient.clear()
    router.replace("/(auth)/login")
  }

  const isPending = userQuery.isPending || reviewsQuery.isPending

  return (
    <SafeAreaView className='flex-1 bg-[#101e22]' edges={["bottom"]}>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Profile Header */}
        {isPending ? (
          <ProfileHeaderSkeleton />
        ) : (
          <View className='items-center pt-6 pb-2 px-4'>
            {/* Avatar */}
            <View className='relative mb-4'>
              <View className='w-32 h-32 rounded-full border-4 border-[#0db9f2] overflow-hidden bg-[#1c2a30]'>
                {userQuery.data?.image ? (
                  <Image
                    source={{ uri: userQuery.data.image }}
                    className='w-full h-full'
                    resizeMode='cover'
                  />
                ) : (
                  <View className='w-full h-full items-center justify-center'>
                    <Ionicons name='person' size={48} color='#0db9f2' />
                  </View>
                )}
              </View>
              {/* Edit button */}
              <View className='absolute bottom-1 right-1 bg-[#25363d] p-1.5 rounded-full border border-gray-700'>
                <Ionicons name='pencil' size={16} color='#0db9f2' />
              </View>
            </View>

            {/* Name & Username */}
            <Text className='text-white text-2xl font-bold tracking-tight text-center'>
              {userQuery.data?.name || "CineRate User"}
            </Text>
            {userQuery.data?.username && (
              <Text className='text-[#9cb2ba] text-sm font-medium mt-1'>
                @{userQuery.data.username}
              </Text>
            )}
          </View>
        )}

        {/* Stats Row */}
        {isPending ? (
          <StatsRowSkeleton />
        ) : (
          <View className='flex-row justify-center gap-3 px-4 py-4'>
            <StatCard
              value={userQuery.data?._count?.reviews || 0}
              label='Reviews'
              isPrimary
            />
            <StatCard value='-' label='Following' />
            <StatCard value='-' label='Followers' />
          </View>
        )}

        <View className='h-px bg-gray-800 my-2' />

        {/* My Reviews Section */}
        <View className='px-4 pt-4 pb-2 flex-row items-center justify-between'>
          <Text className='text-white text-xl font-bold'>My Reviews</Text>
          {reviewsQuery.data && reviewsQuery.data.length > 0 && (
            <Text className='text-[#0db9f2] text-sm font-semibold'>
              View all
            </Text>
          )}
        </View>

        {/* Reviews List */}
        <View className='px-4 gap-4'>
          {reviewsQuery.isPending ? (
            <>
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </>
          ) : reviewsQuery.data && reviewsQuery.data.length > 0 ? (
            reviewsQuery.data
              .slice(0, 5)
              .map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <View className='items-center py-12'>
              <Ionicons name='film-outline' size={48} color='#1c2a30' />
              <Text className='text-[#9cb2ba] text-base font-medium mt-4'>
                No reviews yet
              </Text>
              <Text className='text-[#64748b] text-sm mt-1'>
                Start rating movies to see them here
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View className='px-4 mt-8'>
          <Pressable
            className='flex-row items-center justify-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/30'
            onPress={handleLogout}
          >
            <Ionicons name='log-out-outline' size={20} color='#ef4444' />
            <Text className='text-red-500 font-semibold'>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
