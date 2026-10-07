import { Link } from 'react-router-dom'
import { formatMinutes } from '../utils/format'
import { RecipePlaceholder } from './Doodles'

function RecipeCard({ recipe }) {
  const totalMinutes = (recipe.prepTimeMinutes ?? 0) + (recipe.cookTimeMinutes ?? 0)

  return (
    <Link to={`/recipes/${recipe.slug}`} className="recipe-card">
      <div className="recipe-card-image">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt="" loading="lazy" />
        ) : (
          <span className="image-placeholder" aria-hidden="true">
            <RecipePlaceholder id={recipe.id} />
          </span>
        )}
        {recipe.favorite && (
          <span className="favorite-badge" title="Favorite">
            ♥
          </span>
        )}
      </div>
      <div className="recipe-card-body">
        <span className="recipe-card-category">{recipe.category?.name}</span>
        <h3>{recipe.title}</h3>
        {recipe.authorName && <p className="muted">by {recipe.authorName}</p>}
        <p className="recipe-card-meta">
          <span>
            {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
          </span>
          {totalMinutes > 0 && <span>{formatMinutes(totalMinutes)}</span>}
        </p>
        {recipe.tags.length > 0 && (
          <ul className="tag-list">
            {recipe.tags.map((tag) => (
              <li key={tag.id} className="tag">
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  )
}

export default RecipeCard
