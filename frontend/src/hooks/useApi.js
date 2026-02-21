import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api'

// ============ Query Keys ============
export const queryKeys = {
  athletes: ['athletes'],
  athlete: (id) => ['athletes', id],
  meets: ['meets'],
  meet: (id) => ['meets', id],
  meetResults: (meetId) => ['meets', meetId, 'results'],
  topTimes: ['top-times'],
}

// ============ Athletes Hooks ============

/**
 * Fetch all athletes
 */
export function useAthletes() {
  return useQuery({
    queryKey: queryKeys.athletes,
    queryFn: api.getAthletes,
  })
}

/**
 * Fetch a single athlete
 */
export function useAthlete(id) {
  return useQuery({
    queryKey: queryKeys.athlete(id),
    queryFn: () => api.getAthlete(id),
    enabled: !!id,
  })
}

/**
 * Create a new athlete
 */
export function useCreateAthlete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.athletes })
    },
  })
}

/**
 * Update an athlete
 */
export function useUpdateAthlete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => api.updateAthlete(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.athletes })
      queryClient.invalidateQueries({ queryKey: queryKeys.athlete(id) })
    },
  })
}

/**
 * Delete an athlete
 */
export function useDeleteAthlete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.athletes })
    },
  })
}

// ============ Meets Hooks ============

/**
 * Fetch all meets
 */
export function useMeets() {
  return useQuery({
    queryKey: queryKeys.meets,
    queryFn: api.getMeets,
  })
}

/**
 * Fetch a single meet
 */
export function useMeet(id) {
  return useQuery({
    queryKey: queryKeys.meet(id),
    queryFn: () => api.getMeet(id),
    enabled: !!id,
  })
}

/**
 * Create a new meet
 */
export function useCreateMeet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createMeet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meets })
    },
  })
}

/**
 * Update a meet
 */
export function useUpdateMeet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => api.updateMeet(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meets })
      queryClient.invalidateQueries({ queryKey: queryKeys.meet(id) })
    },
  })
}

/**
 * Delete a meet
 */
export function useDeleteMeet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteMeet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meets })
    },
  })
}

// ============ Results Hooks ============

/**
 * Fetch results for a specific meet
 */
export function useMeetResults(meetId) {
  return useQuery({
    queryKey: queryKeys.meetResults(meetId),
    queryFn: () => api.getMeetResults(meetId),
    enabled: !!meetId,
  })
}

/**
 * Create a new result
 */
export function useCreateResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.createResult,
    onSuccess: (_, { meetId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetResults(meetId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.topTimes })
    },
  })
}

/**
 * Delete a result
 */
export function useDeleteResult() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: api.deleteResult,
    onSuccess: () => {
      // Invalidate all meet results and top times
      queryClient.invalidateQueries({ queryKey: ['meets'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.topTimes })
    },
  })
}

// ============ Analytics Hooks ============

/**
 * Fetch top 10 fastest times
 */
export function useTopTimes() {
  return useQuery({
    queryKey: queryKeys.topTimes,
    queryFn: api.getTopTimes,
  })
}
