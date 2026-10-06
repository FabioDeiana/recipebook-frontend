import { unitLabel } from './units'

// Serving scaling: quantity * newServings / servings; TO_TASTE and null stay unchanged
export function scaleQuantity(quantity, unit, servings, newServings) {
  if (quantity == null || unit === 'TO_TASTE') return quantity
  return (quantity * newServings) / servings
}

export function formatQuantity(quantity) {
  if (quantity == null) return ''
  const decimals = quantity >= 100 ? 0 : quantity >= 10 ? 1 : 2
  return String(Number(quantity.toFixed(decimals)))
}

// e.g. "400 g chickpeas (cooked)", "2 onions", "salt, to taste"
export function formatIngredient({ name, quantity, unit, note }) {
  let text
  if (unit === 'TO_TASTE') {
    text = quantity != null ? `${formatQuantity(quantity)} ${name}, to taste` : `${name}, to taste`
  } else if (unit === 'PIECE') {
    text = quantity != null ? `${formatQuantity(quantity)} ${name}` : name
  } else if (quantity != null) {
    text = `${formatQuantity(quantity)} ${unitLabel(unit, quantity)} ${name}`
  } else {
    text = `${name} (${unitLabel(unit)})`
  }
  return note ? `${text} (${note})` : text
}

export function formatMinutes(minutes) {
  if (minutes == null) return null
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

// "YYYY-MM-DD" -> "6 Oct 2026" (parsed as a local date, no timezone shift)
export function formatDate(isoDate) {
  if (!isoDate) return null
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
