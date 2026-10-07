import { Link, useNavigate, useParams } from 'react-router-dom'
import { getRecipe, updateRecipe } from '../api/recipes'
import { useApi } from '../hooks/useApi'
import RecipeForm from '../components/RecipeForm'
import FormPageHeader from '../components/FormPageHeader'
import ErrorMessage from '../components/ErrorMessage'
import NotFoundPage from './NotFoundPage'

function EditRecipePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: recipe, error, loading } = useApi(() => getRecipe(slug), [slug])

  if (error?.status === 404) return <NotFoundPage message="This recipe doesn't exist." />
  if (error) return <ErrorMessage error={error} />
  if (loading || !recipe) return <p className="muted">Loading…</p>

  // The slug changes if the title changes: go to the one in the response
  async function handleSubmit(payload) {
    const updated = await updateRecipe(recipe.id, payload)
    navigate(`/recipes/${updated.slug}`, { replace: true })
  }

  return (
    <section className="narrow">
      <Link to={`/recipes/${recipe.slug}`} className="back-link">
        ← Back to recipe
      </Link>
      <FormPageHeader kicker="A little tweak" title="Edit recipe" />
      <RecipeForm key={recipe.id} recipe={recipe} submitLabel="Save changes" onSubmit={handleSubmit} />
    </section>
  )
}

export default EditRecipePage
