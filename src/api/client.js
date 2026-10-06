const BASE_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'token'

// Endpoints that accept non-GET requests without a token
const PUBLIC_WRITE_PATHS = ['/api/auth/login', '/api/friend-recipes']

export class ApiError extends Error {
  constructor(status, message, { errors = null, retryAfter = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors // field -> message, only for validation errors
    this.retryAfter = retryAfter // seconds, only for 429
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Called when a protected request gets a 401 (missing, expired or invalid token)
let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function isProtected(method, path) {
  if (method === 'GET') return false
  return !PUBLIC_WRITE_PATHS.some((publicPath) => path.startsWith(publicPath))
}

async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const url = new URL(path, BASE_URL)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const protectedRequest = isProtected(method, path)
  const token = getToken()
  if (protectedRequest && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again later.')
  }

  const data = await parseBody(response)

  if (response.ok) return data

  if (response.status === 401 && protectedRequest) {
    clearToken()
    if (unauthorizedHandler) unauthorizedHandler()
    throw new ApiError(401, 'Your session has expired. Please log in again.')
  }

  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('Retry-After')) || null
    throw new ApiError(429, data?.message || 'Too many requests. Please try again later.', {
      retryAfter,
    })
  }

  throw new ApiError(response.status, data?.message || 'Something went wrong.', {
    errors: data?.errors || null,
  })
}

export const api = {
  get: (path, params) => request(path, { params }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
