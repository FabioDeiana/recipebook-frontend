import { useEffect, useId, useState } from 'react'
import { searchIngredients } from '../api/catalog'

// Free-text ingredient name with suggestions from existing ingredients
function IngredientNameInput({ value, onChange, ...props }) {
  const listId = useId()
  const [focused, setFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const search = value.trim()
    if (!focused || search.length < 2) return
    let ignore = false
    const timer = setTimeout(() => {
      searchIngredients(search)
        .then((results) => {
          if (!ignore) setSuggestions(results)
        })
        .catch(() => {})
    }, 250)
    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [value, focused])

  return (
    <>
      <input
        {...props}
        type="text"
        list={listId}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <datalist id={listId}>
        {suggestions.map((ingredient) => (
          <option key={ingredient.id} value={ingredient.name} />
        ))}
      </datalist>
    </>
  )
}

export default IngredientNameInput
