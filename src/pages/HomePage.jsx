import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRecipes } from '../api/recipes'
import { getCategories } from '../api/catalog'
import { useApi } from '../hooks/useApi'
import RecipeCard from '../components/RecipeCard'
import Reveal from '../components/Reveal'
import {
  Basil,
  CategoryDrawing,
  Lemon,
  LemonSlice,
  RecipeNotebook,
  Rosemary,
  SteamingPot,
  Tomatoes,
  WoodenSpoon,
} from '../components/Doodles'

const ROW_SIZE = 4

// A titled row of recipe cards; hidden when there is nothing to show
function RecipeRow({ title, subtitle, params, seeAllTo }) {
  const { data } = useApi(() => getRecipes({ ...params, size: ROW_SIZE }), [])
  const recipes = data?.content ?? []
  if (recipes.length === 0) return null

  return (
    <Reveal as="section" className="home-section">
      <div className="home-section-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        <Link to={seeAllTo} className="see-all">
          See all →
        </Link>
      </div>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Reveal>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const categories = useApi(getCategories, [])
  const ownCount = useApi(() => getRecipes({ section: 'OWN', size: 1 }), [])

  function handleSearch(event) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/recipes?search=${encodeURIComponent(query)}` : '/recipes')
  }

  const noRecipesYet = ownCount.data?.page.totalElements === 0

  return (
    <div className="home">
      <section className="hero">
        <Basil className="hero-doodle hero-basil" />
        <Rosemary className="hero-doodle hero-rosemary" />
        <WoodenSpoon className="hero-doodle hero-spoon" />
        <Lemon className="hero-doodle hero-lemon" />
        <LemonSlice className="hero-doodle hero-lemon-slice" />
        <Tomatoes className="hero-doodle hero-tomatoes" />
        <p className="hero-kicker">Homemade, with love</p>
        <h1 className="hero-title">Emma&apos;s Cookbook</h1>
        <p className="hero-text">
          Simple vegetarian and vegan recipes, the ones I cook every day and the ones I save for
          special occasions.
        </p>
        <form className="hero-search" onSubmit={handleSearch} role="search">
          <input
            type="search"
            placeholder="What shall we cook today?"
            aria-label="Search recipes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="button">
            Search
          </button>
        </form>
      </section>

      {categories.data?.length > 0 && (
        <section className="home-section">
          <h2 className="center">Browse by category</h2>
          <ul className="category-tiles">
            {categories.data.map((category, index) => (
              <li key={category.id} style={{ '--i': index }}>
                <Link to={`/recipes?categoryId=${category.id}`} className="category-tile">
                  <span className="category-icon" aria-hidden="true">
                    <CategoryDrawing name={category.name} />
                  </span>
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {noRecipesYet && (
        <div className="empty-state">
          <SteamingPot className="empty-doodle" />
          <p>The first recipes are coming soon…</p>
        </div>
      )}

      <RecipeRow
        title="Latest recipes"
        subtitle="Fresh from the kitchen"
        params={{ section: 'OWN', sort: 'createdAt,desc' }}
        seeAllTo="/recipes"
      />

      <RecipeRow
        title="My favorites"
        subtitle="The ones I make again and again"
        params={{ section: 'OWN', favorite: true, sort: 'title,asc' }}
        seeAllTo="/recipes?favorite=true"
      />

      <RecipeRow
        title="From my friends"
        subtitle="Recipes shared by the people I love"
        params={{ section: 'FRIENDS', sort: 'createdAt,desc' }}
        seeAllTo="/friends"
      />

      <Reveal as="section" className="share-banner">
        <RecipeNotebook className="share-doodle" />
        <div className="share-text">
          <h2>Have a recipe to share?</h2>
          <p>Send me your favorite vegetarian or vegan dish and it will join Friends&apos; Recipes.</p>
        </div>
        <Link to="/submit" className="button">
          Share a recipe
        </Link>
      </Reveal>
    </div>
  )
}

export default HomePage
