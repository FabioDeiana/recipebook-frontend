import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitFriendRecipe } from '../api/recipes'
import RecipeForm from '../components/RecipeForm'

function SubmitRecipePage() {
  const [submittedBy, setSubmittedBy] = useState(null)
  const [formKey, setFormKey] = useState(0)

  async function handleSubmit(payload) {
    try {
      await submitFriendRecipe(payload)
    } catch (err) {
      if (err.status === 429) {
        throw new Error("You've shared a lot of recipes in the last hour. Please try again later!")
      }
      throw err
    }
    setSubmittedBy(payload.authorName.trim())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function shareAnother() {
    setSubmittedBy(null)
    setFormKey((key) => key + 1)
  }

  if (submittedBy) {
    return (
      <section className="narrow center">
        <h1>Thank you, {submittedBy}!</h1>
        <p>Your recipe has been shared.</p>
        <div className="button-row">
          <Link to="/friends" className="button">
            See Friends&apos; Recipes
          </Link>
          <button type="button" className="button secondary" onClick={shareAnother}>
            Share another
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="narrow">
      <div className="page-heading">
        <h1>Share a recipe</h1>
        <p className="muted">
          Have a vegetarian or vegan recipe you love? Share it and it will appear in Friends&apos;
          Recipes.
        </p>
      </div>
      <RecipeForm key={formKey} variant="friend" submitLabel="Share recipe" onSubmit={handleSubmit} />
    </section>
  )
}

export default SubmitRecipePage
