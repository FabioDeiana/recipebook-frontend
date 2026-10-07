import { useNavigate } from 'react-router-dom'
import { createRecipe } from '../api/recipes'
import RecipeForm from '../components/RecipeForm'
import FormPageHeader from '../components/FormPageHeader'

function NewRecipePage() {
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    const recipe = await createRecipe(payload)
    navigate(`/recipes/${recipe.slug}`)
  }

  return (
    <section className="narrow">
      <FormPageHeader kicker="Something new in the kitchen" title="New recipe" />
      <RecipeForm submitLabel="Create recipe" onSubmit={handleSubmit} />
    </section>
  )
}

export default NewRecipePage
