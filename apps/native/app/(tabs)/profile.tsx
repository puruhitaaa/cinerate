import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { router, Stack } from "expo-router"
import { useCallback } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { authClient } from "@/lib/auth-client"
import { client, orpc, queryClient } from "@/utils/orpc"

// --- Interfaces ---

interface Review {
  id: string
  rating: number
  content: string | null
  tmdbMovieId: number
  createdAt: Date | string
  userId: string
}

// --- Components ---

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
    <View className='flex-1 items-center justify-center rounded-2xl bg-[#151f23] py-4 border border-[#1e2b30] shadow-sm'>
      <Text
        className={`text-2xl font-extrabold tracking-tight ${
          isPrimary ? "text-[#0db9f2]" : "text-white"
        }`}
      >
        {value}
      </Text>
      <Text className='mt-1 text-[10px] font-bold uppercase tracking-widest text-[#7a8c99]'>
        {label}
      </Text>
    </View>
  )
}

function LoadingReviewCard() {
  return (
    <View className='mb-4 flex-row overflow-hidden rounded-2xl bg-[#151f23] p-3 border border-[#1e2b30]'>
      <View className='h-32 w-24 rounded-lg bg-[#1e2b30] animate-pulse' />
      <View className='ml-4 flex-1 justify-center gap-3'>
        <View className='h-5 w-3/4 rounded bg-[#1e2b30] animate-pulse' />
        <View className='h-4 w-1/2 rounded bg-[#1e2b30] animate-pulse' />
        <View className='h-4 w-full rounded bg-[#1e2b30] animate-pulse' />
      </View>
    </View>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const { data: movie, isLoading } = useQuery(
    orpc.tmdb.getMovie.queryOptions({ input: { id: review.tmdbMovieId } })
  )

  if (isLoading) return <LoadingReviewCard />

  const date = new Date(review.createdAt)
  const timeAgo = getTimeAgo(date)
  const year = movie?.release_date?.split("-")[0] || "N/A"
  const genre = movie?.genres?.[0]?.name || "Film"
  const title = movie?.title || `Movie #${review.tmdbMovieId}`
  const posterPath = movie?.poster_path
  const reviewContent = review.content || "No review content..."

  return (
    <Pressable
      className='mb-4 flex-row overflow-hidden rounded-2xl bg-[#151f23] p-3 border border-[#1e2b30]'
      onPress={() => router.push(`/movie/${review.tmdbMovieId}`)}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <View className='h-32 w-24 rounded-lg bg-[#0f191d] shadow-sm overflow-hidden'>
        {posterPath ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${posterPath}`,
            }}
            className='h-full w-full'
            resizeMode='cover'
          />
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='film' size={24} color='#2d3b42' />
          </View>
        )}
      </View>

      <View className='ml-4 flex-1 py-1'>
        <View className='flex-row items-center justify-between'>
          <Text
            className='flex-1 text-lg font-bold text-white leading-tight'
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className='ml-2 text-xs font-medium text-[#566874]'>
            {timeAgo}
          </Text>
        </View>

        <Text className='mt-1 text-xs font-medium text-[#7a8c99]'>
          {year} • {genre}
        </Text>

        <View className='mt-2 flex-row gap-0.5'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name='star'
              size={14}
              color={star <= review.rating ? "#0db9f2" : "#2a363d"}
            />
          ))}
        </View>

        <Text
          className='mt-3 text-sm leading-5 text-[#8b9da9]'
          numberOfLines={2}
        >
          {reviewContent}
        </Text>
      </View>
    </Pressable>
  )
}

function ListFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null
  return (
    <View className='py-6 items-center'>
      <ActivityIndicator size='small' color='#0db9f2' />
      <Text className='mt-2 text-xs text-[#566874]'>Loading more...</Text>
    </View>
  )
}

function EmptyState() {
  return (
    <View className='mt-8 items-center justify-center opacity-50'>
      <Ionicons name='film-outline' size={48} color='#2d3b42' />
      <Text className='mt-4 text-[#566874]'>No reviews yet</Text>
    </View>
  )
}

// --- Profile Header Component ---

function ProfileHeader({
  userName,
  userImage,
  reviewCount,
  onLogout,
}: {
  userName: string | undefined
  userImage: string | null | undefined
  reviewCount: number
  onLogout: () => void
}) {
  return (
    <View>
      <View className='flex-row items-center justify-between py-4'>
        <View style={{ width: 24 }} />
        <Text className='text-lg font-bold text-white'>Profile</Text>
        <Pressable
          onPress={onLogout}
          className='rounded-full p-2 active:bg-[#1c2a30]'
        >
          <Ionicons name='log-out-outline' size={24} color='#7a8c99' />
        </Pressable>
      </View>

      <View className='items-center pt-4 pb-8'>
        <View className='relative mb-5'>
          <View className='absolute -inset-1 rounded-full bg-[#0db9f2] opacity-30 shadow-lg' />

          <View className='h-32 w-32 rounded-full border-[3px] border-[#0db9f2] p-1 bg-[#101e22]'>
            <View className='h-full w-full overflow-hidden rounded-full bg-[#1c2a30]'>
              {userImage ? (
                <Image source={{ uri: userImage }} className='h-full w-full' />
              ) : (
                <View className='flex-1 items-center justify-center bg-[#1c2a30]'>
                  <Ionicons name='person' size={48} color='#3d4f58' />
                </View>
              )}
            </View>
          </View>
        </View>

        <Text className='mb-1 text-2xl font-bold tracking-tight text-white'>
          {userName}
        </Text>
        <Text className='text-sm font-medium text-[#7a8c99]'>
          Film enthusiast & critic
        </Text>
      </View>

      <View className='mb-10 flex-row gap-4'>
        <StatCard value={reviewCount} label='Reviews' isPrimary />
      </View>

      <View className='mb-4 flex-row items-center'>
        <Text className='text-xl font-bold text-white'>My Reviews</Text>
      </View>
    </View>
  )
}

// --- Main Screen ---

export default function ProfileScreen() {
  const userQuery = useQuery(orpc.user.getMe.queryOptions())

  const reviewsInfiniteQuery = useInfiniteQuery({
    queryKey: ["myReviews"],
    queryFn: async ({ pageParam }) => {
      console.log("[Profile] Fetching reviews with cursor:", pageParam)
      const result = await client.review.getMyReviews({
        ...(pageParam ? { cursor: pageParam } : {}),
        limit: 10,
      })
      console.log("[Profile] Fetched reviews:", result)
      return result
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const handleLogoutPress = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                queryClient.clear()
                router.replace("/(auth)/login")
              },
            },
          })
        },
      },
    ])
  }, [])

  const handleEndReached = useCallback(() => {
    if (
      reviewsInfiniteQuery.hasNextPage &&
      !reviewsInfiniteQuery.isFetchingNextPage
    ) {
      reviewsInfiniteQuery.fetchNextPage()
    }
  }, [reviewsInfiniteQuery])

  const reviewCount = userQuery.data?._count?.reviews || 0
  const userName = userQuery.data?.name
  const userImage = userQuery.data?.image

  // Flatten all pages into a single array of reviews
  const allReviews =
    reviewsInfiniteQuery.data?.pages
      .flatMap((page) => page.items ?? [])
      .filter(Boolean) ?? []

  return (
    <View style={{ flex: 1, backgroundColor: "#101e22" }}>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#101e22" },
        }}
      />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#101e22" }}
        edges={["top"]}
      >
        <FlashList
          data={allReviews}
          keyExtractor={(item, index) => item?.id ?? `review-${index}`}
          renderItem={({ item }) => <ReviewCard review={item} />}
          // estimatedItemSize={160}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ListHeaderComponent={
            <ProfileHeader
              userName={userName}
              userImage={userImage ?? null}
              reviewCount={reviewCount}
              onLogout={handleLogoutPress}
            />
          }
          ListEmptyComponent={
            reviewsInfiniteQuery.isPending ? (
              <>
                <LoadingReviewCard />
                <LoadingReviewCard />
              </>
            ) : (
              <EmptyState />
            )
          }
          ListFooterComponent={
            <ListFooter isLoading={reviewsInfiniteQuery.isFetchingNextPage} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  )
}

// --- Helpers ---

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
