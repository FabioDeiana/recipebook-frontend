import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import { getCategories, getTags } from '../api/catalog'
import { useApi } from '../hooks/useApi'
import RecipeCard from '../components/RecipeCard'
import Pagination from '../components/Pagination'
import ErrorMessage from '../components/ErrorMessage'
import { Basil, Lemon, RecipeNotebook, SteamingPot, Tomatoes } from '../components/Doodles'

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

  const total = recipes.data?.page.totalElements

  return (
    <section>
      <header className={`list-hero${isFriends ? ' friends' : ''}`}>
        {isFriends ? (
          <>
            <RecipeNotebook className="list-hero-doodle left" />
            <Tomatoes className="list-hero-doodle right" />
          </>
        ) : (
          <>
            <Basil className="list-hero-doodle left" />
            <Lemon className="list-hero-doodle right" />
          </>
        )}
        <p className="script-kicker">{isFriends ? 'With love, from friends' : "From Emma's kitchen"}</p>
        <h1>{isFriends ? 'Friends’ Recipes' : 'Recipes'}</h1>
        <p className="muted">
          {isFriends
            ? 'Dishes shared by the people who love to cook with Emma.'
            : 'Everything I cook, from quick weekday dinners to special treats.'}
        </p>
        {isFriends && (
          <Link to="/submit" className="button list-hero-cta">
            Share yours
          </Link>
        )}
      </header>

      <div className="filters">
        <div className="filter-search">
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 L21 21" />
          </svg>
          <input
            type="search"
            placeholder="Search recipes, ingredients, tags…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search"
          />
        </div>
        <div className="filter-selects">
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
          <label className={`favorite-toggle${favorite ? ' active' : ''}`}>
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => updateParam('favorite', e.target.checked ? 'true' : '')}
            />
            {favorite ? '♥' : '♡'} Favorites
          </label>
        </div>
      </div>

      <div className="results-bar">
        <span className="muted">
          {total != null && `${total} ${total === 1 ? 'recipe' : 'recipes'}`}
        </span>
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
            <div className="empty-state">
              <SteamingPot className="empty-doodle" />
              <p>{hasFilters ? 'No recipes match your search.' : 'No recipes here yet.'}</p>
              {isFriends && !hasFilters && (
                <Link to="/submit" className="button">
                  Be the first to share one
                </Link>
              )}
            </div>
          ) : (
            <div className={`recipe-grid list-grid${recipes.loading ? ' is-loading' : ''}`}>
              {recipes.data.content.map((recipe, index) => (
                <div key={recipe.id} className="grid-item" style={{ '--i': index }}>
                  <RecipeCard recipe={recipe} />
                </div>
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
