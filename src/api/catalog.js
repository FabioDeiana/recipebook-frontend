import { api } from './client'

export function getCategories() {
  return api.get('/api/categories')
}

export function createCategory(name) {
  return api.post('/api/categories', { name })
}

export function updateCategory(id, name) {
  return api.put(`/api/categories/${id}`, { name })
}

export function deleteCategory(id) {
  return api.delete(`/api/categories/${id}`)
}

export function getTags() {
  return api.get('/api/tags')
}

export function createTag(name) {
  return api.post('/api/tags', { name })
}

export function deleteTag(id) {
  return api.delete(`/api/tags/${id}`)
}

export function searchIngredients(search) {
  return api.get('/api/ingredients', { search })
}
