import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep unused queries for 10 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Prevent unnecessary refetching
    },
  },
})
