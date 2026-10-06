import { api } from './client'

export function login(username, password) {
  return api.post('/api/auth/login', { username, password })
}

export function changePassword(currentPassword, newPassword) {
  return api.patch('/api/auth/password', { currentPassword, newPassword })
}
