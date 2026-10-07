import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adoptRecipe, deleteRecipe, getRecipe, markCooked, toggleFavorite } from '../api/recipes'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../auth/useAuth'
import ErrorMessage from '../components/ErrorMessage'
import { RecipePlaceholder } from '../components/Doodles'
import NotFoundPage from './NotFoundPage'
import { formatDate, formatMinutes, ingredientParts, scaleQuantity } from '../utils/format'

function RecipeDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { data: recipe, error, loading, setData } = useApi(() => getRecipe(slug), [slug])

  // Chosen servings, remembered per recipe so another recipe starts from its own default
  const [chosenServings, setChosenServings] = useState({ recipeId: null, value: null })
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)

  if (error?.status === 404) return <NotFoundPage message="This recipe doesn't exist." />
  if (error) return <ErrorMessage error={error} />
  if (loading || !recipe) return <p className="muted">Loading…</p>

  async function runAction(action) {
    setBusy(true)
    setActionError(null)
    try {
      await action()
    } catch (err) {
      setActionError(err)
    } finally {
      setBusy(false)
    }
  }

  const handleFavorite = () => runAction(async () => setData(await toggleFavorite(recipe.id)))

  const handleCooked = () => runAction(async () => setData(await markCooked(recipe.id)))

  const handleAdopt = () =>
    runAction(async () => {
      const copy = await adoptRecipe(recipe.id)
      navigate(`/recipes/${copy.slug}`)
    })

  const handleDelete = () => {
    if (!window.confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return
    runAction(async () => {
      await deleteRecipe(recipe.id)
      navigate(recipe.section === 'FRIENDS' ? '/friends' : '/recipes', { replace: true })
    })
  }

  const currentServings =
    chosenServings.recipeId === recipe.id ? chosenServings.value : recipe.servings
  const setServings = (value) => setChosenServings({ recipeId: recipe.id, value })
  const isFriends = recipe.section === 'FRIENDS'
  const listPath = isFriends ? '/friends' : '/recipes'
  const totalMinutes =
    recipe.prepTimeMinutes != null && recipe.cookTimeMinutes != null
      ? recipe.prepTimeMinutes + recipe.cookTimeMinutes
      : null

  return (
    <article className="recipe-detail">
      <Link to={listPath} className="back-link">
        ← {isFriends ? 'Friends’ Recipes' : 'Recipes'}
      </Link>

      <header className="recipe-hero">
        <div className="recipe-hero-image">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} />
          ) : (
            <div className="recipe-hero-placeholder" aria-hidden="true">
              <RecipePlaceholder id={recipe.id} />
            </div>
          )}
          {recipe.favorite && (
            <span className="favorite-badge large" title="Favorite">
              ♥
            </span>
          )}
        </div>

        <div className="recipe-hero-info">
          {recipe.category && (
            <Link to={`${listPath}?categoryId=${recipe.category.id}`} className="recipe-category-link">
              {recipe.category.name}
            </Link>
          )}
          <h1>{recipe.title}</h1>
          {recipe.authorName && <p className="recipe-byline">Shared by {recipe.authorName}</p>}
          {recipe.adaptedFrom && <p className="recipe-byline">{recipe.adaptedFrom}</p>}
          {recipe.description && <p className="recipe-description">{recipe.description}</p>}

          <dl className="recipe-stats">
            <div>
              <dt>Servings</dt>
              <dd>{recipe.servings}</dd>
            </div>
            {recipe.prepTimeMinutes != null && (
              <div>
                <dt>Prep</dt>
                <dd>{formatMinutes(recipe.prepTimeMinutes)}</dd>
              </div>
            )}
            {recipe.cookTimeMinutes != null && (
              <div>
                <dt>Cook</dt>
                <dd>{formatMinutes(recipe.cookTimeMinutes)}</dd>
              </div>
            )}
            {totalMinutes != null && totalMinutes > 0 && (
              <div>
                <dt>Total</dt>
                <dd>{formatMinutes(totalMinutes)}</dd>
              </div>
            )}
            <div>
              <dt>Last cooked</dt>
              <dd>{recipe.lastCookedAt ? formatDate(recipe.lastCookedAt) : 'Never'}</dd>
            </div>
          </dl>

          {recipe.tags.length > 0 && (
            <ul className="tag-list">
              {recipe.tags.map((tag) => (
                <li key={tag.id}>
                  <Link to={`${listPath}?tagId=${tag.id}`} className="tag">
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {isAdmin && (
        <div className="admin-toolbar">
          <span className="admin-toolbar-label">Your tools</span>
          <div className="admin-actions">
            <Link to={`/admin/recipes/${recipe.slug}/edit`} className="button secondary">
              ✎ Edit
            </Link>
            <button type="button" className="button secondary" disabled={busy} onClick={handleFavorite}>
              {recipe.favorite ? '♥ Unfavorite' : '♡ Favorite'}
            </button>
            <button type="button" className="button secondary" disabled={busy} onClick={handleCooked}>
              ✓ Cooked today
            </button>
            {isFriends && (
              <button type="button" className="button secondary" disabled={busy} onClick={handleAdopt}>
                ⧉ Copy to my recipes
              </button>
            )}
            <button type="button" className="button danger" disabled={busy} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      <ErrorMessage error={actionError} />

      <div className="recipe-body">
        <aside className="ingredients-card">
          <div className="ingredients-heading">
            <h2>Ingredients</h2>
            <div className="servings-control">
              <button
                type="button"
                aria-label="Fewer servings"
                disabled={currentServings <= 1}
                onClick={() => setServings(currentServings - 1)}
              >
                −
              </button>
              <span>
                <strong>{currentServings}</strong> {currentServings === 1 ? 'serving' : 'servings'}
              </span>
              <button
                type="button"
                aria-label="More servings"
                disabled={currentServings >= 100}
                onClick={() => setServings(currentServings + 1)}
              >
                +
              </button>
            </div>
          </div>
          {currentServings !== recipe.servings && (
            <button
              type="button"
              className="link-button reset-servings"
              onClick={() => setServings(recipe.servings)}
            >
              Reset to {recipe.servings}
            </button>
          )}
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient) => {
              const parts = ingredientParts({
                ...ingredient,
                quantity: scaleQuantity(
                  ingredient.quantity,
                  ingredient.unit,
                  recipe.servings,
                  currentServings,
                ),
              })
              return (
                <li key={ingredient.id}>
                  {parts.amount && <strong className="ingredient-amount">{parts.amount}</strong>}
                  <span>
                    {parts.name}
                    {parts.suffix}
                    {parts.note && <span className="ingredient-note-text"> ({parts.note})</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="method">
          <h2>Method</h2>
          <ol className="step-list">
            {recipe.steps.map((step) => (
              <li key={step.stepNumber}>
                <span className="step-badge" aria-hidden="true">
                  {step.stepNumber}
                </span>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="enjoy-note">Enjoy your meal! ♥</p>
        </section>
      </div>
    </article>
  )
}

export default RecipeDetailPage
