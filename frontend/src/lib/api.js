/**
 * API client for Jones County XC backend
 * All endpoints are proxied through Vite to http://localhost:8080
 */

const API_BASE = '/api'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

// ============ Athletes ============

/**
 * Fetch all athletes
 * GET /api/athletes
 */
export async function getAthletes() {
  return fetchAPI('/athletes')
}

/**
 * Fetch a single athlete by ID
 * GET /api/athletes/:id
 */
export async function getAthlete(id) {
  return fetchAPI(`/athletes/${id}`)
}

/**
 * Create a new athlete
 * POST /api/athletes
 */
export async function createAthlete(data) {
  return fetchAPI('/athletes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Update an athlete
 * PUT /api/athletes/:id
 */
export async function updateAthlete(id, data) {
  return fetchAPI(`/athletes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Delete an athlete
 * DELETE /api/athletes/:id
 */
export async function deleteAthlete(id) {
  return fetchAPI(`/athletes/${id}`, {
    method: 'DELETE',
  })
}

// ============ Meets ============

/**
 * Fetch all meets
 * GET /api/meets
 */
export async function getMeets() {
  return fetchAPI('/meets')
}

/**
 * Fetch a single meet by ID
 * GET /api/meets/:id
 */
export async function getMeet(id) {
  return fetchAPI(`/meets/${id}`)
}

/**
 * Create a new meet
 * POST /api/meets
 */
export async function createMeet(data) {
  return fetchAPI('/meets', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Update a meet
 * PUT /api/meets/:id
 */
export async function updateMeet(id, data) {
  return fetchAPI(`/meets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Delete a meet
 * DELETE /api/meets/:id
 */
export async function deleteMeet(id) {
  return fetchAPI(`/meets/${id}`, {
    method: 'DELETE',
  })
}

// ============ Results ============

/**
 * Fetch results for a specific meet
 * GET /api/meets/:id/results
 */
export async function getMeetResults(meetId) {
  return fetchAPI(`/meets/${meetId}/results`)
}

/**
 * Create a new result
 * POST /api/results
 */
export async function createResult(data) {
  return fetchAPI('/results', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Delete a result
 * DELETE /api/results/:id
 */
export async function deleteResult(id) {
  return fetchAPI(`/results/${id}`, {
    method: 'DELETE',
  })
}

// ============ Analytics ============

/**
 * Fetch top 10 fastest times across all meets
 * GET /api/top-times
 */
export async function getTopTimes() {
  return fetchAPI('/top-times')
}

// ============ Auth ============

/**
 * Login with password
 * POST /api/auth/login
 */
export async function login(password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

/**
 * Verify token
 * GET /api/auth/verify
 */
export async function verifyToken(token) {
  return fetchAPI('/auth/verify', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

/**
 * Logout
 * POST /api/auth/logout
 */
export async function logout(token) {
  return fetchAPI('/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}
