import { api } from './client'

export function getRecipes(params) {
  return api.get('/api/recipes', params)
}

export function getRecipe(slug) {
  return api.get(`/api/recipes/${encodeURIComponent(slug)}`)
}

export function createRecipe(recipe) {
  return api.post('/api/recipes', recipe)
}

export function updateRecipe(id, recipe) {
  return api.put(`/api/recipes/${id}`, recipe)
}

export function deleteRecipe(id) {
  return api.delete(`/api/recipes/${id}`)
}

export function toggleFavorite(id) {
  return api.patch(`/api/recipes/${id}/favorite`)
}

export function markCooked(id) {
  return api.patch(`/api/recipes/${id}/cooked`)
}

export function adoptRecipe(id) {
  return api.post(`/api/recipes/${id}/adopt`)
}

export function submitFriendRecipe(recipe) {
  return api.post('/api/friend-recipes', recipe)
}
