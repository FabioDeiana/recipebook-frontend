import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import { getCategories, getTags } from '../api/catalog'
import { useApi } from '../hooks/useApi'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import ErrorMessage from '../components/ErrorMessage'

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'createdAt,asc', label: 'Oldest first' },
  { value: 'title,asc', label: 'Title A–Z' },
  { value: 'updatedAt,desc', label: 'Recently updated' },
  { value: 'lastCookedAt,asc', label: 'Not cooked in a while' },
]

const PAGE_SIZE = 12

function RecipeListPage({ section }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('categoryId') ?? ''
  const tagId = searchParams.get('tagId') ?? ''
  const favorite = searchParams.get('favorite') === 'true'
  const sort = searchParams.get('sort') ?? SORT_OPTIONS[0].value
  const page = Number(searchParams.get('page') ?? 0)

  const [searchInput, setSearchInput] = useState(search)

  const categories = useApi(getCategories, [])
  const tags = useApi(getTags, [])
  const recipes = useApi(
    () =>
      getRecipes({
        section,
        search,
        categoryId,
        tagId,
        favorite: favorite ? true : undefined,
        sort,
        page,
        size: PAGE_SIZE,
      }),
    [section, search, categoryId, tagId, favorite, sort, page],
  )

  // Change one filter and go back to the first page
  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === '' || value === false || value == null) next.delete(key)
        else next.set(key, value)
        if (key !== 'page') next.delete('page')
        return next
      },
      { replace: key === 'search' },
    )
  }

  // Debounce the search box
  useEffect(() => {
    if (searchInput.trim() === search) return
    const timer = setTimeout(() => updateParam('search', searchInput.trim()), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  function changePage(newPage) {
    updateParam('page', newPage === 0 ? '' : newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    setSearchInput('')
    setSearchParams({})
  }

  const hasFilters = search || categoryId || tagId || favorite
  const isFriends = section === 'FRIENDS'

  return (
    <section>
      <div className="page-heading">
        <h1>{isFriends ? 'Friends’ Recipes' : 'Recipes'}</h1>
        {isFriends && <p className="muted">Recipes shared by friends.</p>}
      </div>

      <div className="filters">
        <input
          type="search"
          className="filter-search"
          placeholder="Search recipes, ingredients, tags…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search"
        />
        <select
          value={categoryId}
          onChange={(e) => updateParam('categoryId', e.target.value)}
          aria-label="Category"
        >
          <option value="">All categories</option>
          {categories.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={tagId} onChange={(e) => updateParam('tagId', e.target.value)} aria-label="Tag">
          <option value="">All tags</option>
          {tags.data?.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} aria-label="Sort">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => updateParam('favorite', e.target.checked ? 'true' : '')}
          />
          Favorites only
        </label>
        {hasFilters && (
          <button type="button" className="link-button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <ErrorMessage error={recipes.error} />

      {recipes.loading && !recipes.data && <p className="muted">Loading…</p>}

      {recipes.data && (
        <>
          {recipes.data.content.length === 0 ? (
            <p className="empty-state">
              {hasFilters ? 'No recipes match your search.' : 'No recipes yet.'}
            </p>
          ) : (
            <div className={`recipe-grid${recipes.loading ? ' is-loading' : ''}`}>
              {recipes.data.content.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
          <Pagination page={recipes.data.page} onChange={changePage} />
        </>
      )}
    </section>
  )
}

export default RecipeListPage
