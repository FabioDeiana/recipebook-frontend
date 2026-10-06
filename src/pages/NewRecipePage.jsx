import { useNavigate } from 'react-router-dom'
import { createRecipe } from '../api/recipes'
import RecipeForm from '../components/RecipeForm'

function NewRecipePage() {
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    const recipe = await createRecipe(payload)
    navigate(`/recipes/${recipe.slug}`)
  }

  return (
    <section className="narrow">
      <h1>New recipe</h1>
      <RecipeForm submitLabel="Create recipe" onSubmit={handleSubmit} />
    </section>
  )
}

export default NewRecipePage
